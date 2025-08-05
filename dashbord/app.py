from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import os
from datetime import datetime
import json
from werkzeug.utils import secure_filename
import sys
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

sys.path.append('src')

from src.data.load_data import load_oil_price_data, load_event_data
from src.modeling.change_point_model import build_model, run_inference, get_change_point, plot_posterior

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Global variables to store data
oil_data = None
event_data = None
analysis_results = None

ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file uploads for oil price and event data"""
    global oil_data, event_data
    
    try:
        if 'oil_price_file' in request.files:
            file = request.files['oil_price_file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                # Load and validate oil price data
                oil_data = load_oil_price_data(filepath)
                oil_data['Date'] = pd.to_datetime(oil_data['Date'])
                
                logger.info(f"Oil price data uploaded: {len(oil_data)} records")
                
                return jsonify({
                    'success': True,
                    'message': f'Oil price data uploaded successfully. {len(oil_data)} records loaded.',
                    'data_preview': oil_data.head().to_dict('records'),
                    'data_info': {
                        'total_records': len(oil_data),
                        'date_range': {
                            'start': oil_data['Date'].min().strftime('%Y-%m-%d'),
                            'end': oil_data['Date'].max().strftime('%Y-%m-%d')
                        },
                        'price_stats': {
                            'mean': float(oil_data['Price'].mean()),
                            'std': float(oil_data['Price'].std()),
                            'min': float(oil_data['Price'].min()),
                            'max': float(oil_data['Price'].max())
                        }
                    }
                })
        
        if 'event_file' in request.files:
            file = request.files['event_file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                # Load and validate event data
                event_data = load_event_data(filepath)
                event_data['Date'] = pd.to_datetime(event_data['Date'])
                
                logger.info(f"Event data uploaded: {len(event_data)} events")
                
                return jsonify({
                    'success': True,
                    'message': f'Event data uploaded successfully. {len(event_data)} events loaded.',
                    'data_preview': event_data.head().to_dict('records'),
                    'data_info': {
                        'total_events': len(event_data),
                        'date_range': {
                            'start': event_data['Date'].min().strftime('%Y-%m-%d'),
                            'end': event_data['Date'].max().strftime('%Y-%m-%d')
                        }
                    }
                })
                
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500
    
    return jsonify({'success': False, 'message': 'No file uploaded'}), 400

@app.route('/api/analyze', methods=['POST'])
def run_analysis():
    """Run change point analysis on uploaded data"""
    global oil_data, analysis_results
    
    if oil_data is None:
        return jsonify({'success': False, 'message': 'Please upload oil price data first'}), 400
    
    try:
        # Prepare data for analysis
        prices = oil_data['Price'].values
        dates = oil_data['Date'].values
        
        logger.info(f"Starting analysis with {len(prices)} data points")
        
        # Build and run model
        model = build_model(prices)
        trace = run_inference(model, draws=500, tune=200)  # Reduced for web demo
        
        # Get change point
        change_point_idx = get_change_point(trace)
        change_point_date = dates[change_point_idx]
        
        # Calculate statistics
        before_change = prices[:change_point_idx]
        after_change = prices[change_point_idx:]
        
        stats = {
            'change_point_date': change_point_date.strftime('%Y-%m-%d'),
            'change_point_index': int(change_point_idx),
            'mean_before': float(np.mean(before_change)),
            'mean_after': float(np.mean(after_change)),
            'std_before': float(np.std(before_change)),
            'std_after': float(np.std(after_change)),
            'price_change': float(np.mean(after_change) - np.mean(before_change)),
            'price_change_pct': float(((np.mean(after_change) - np.mean(before_change)) / np.mean(before_change)) * 100),
            'total_data_points': len(prices),
            'points_before_change': len(before_change),
            'points_after_change': len(after_change)
        }
        
        # Generate plots
        plots = generate_analysis_plots(prices, dates, change_point_idx, trace)
        
        analysis_results = {
            'stats': stats,
            'plots': plots,
            'trace_summary': {
                'mu1_mean': float(trace.posterior['mu1'].mean()),
                'mu2_mean': float(trace.posterior['mu2'].mean()),
                'sigma_mean': float(trace.posterior['sigma'].mean())
            }
        }
        
        logger.info(f"Analysis completed. Change point detected at {change_point_date}")
        
        return jsonify({
            'success': True,
            'message': 'Analysis completed successfully',
            'results': analysis_results
        })
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({'success': False, 'message': f'Analysis error: {str(e)}'}), 500

def generate_analysis_plots(prices, dates, change_point_idx, trace):
    """Generate analysis plots and convert to base64 for web display"""
    plots = {}
    
    # Set style
    plt.style.use('seaborn-v0_8')
    
    # 1. Time series with change point
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.plot(dates, prices, 'b-', alpha=0.7, linewidth=1)
    ax.axvline(x=dates[change_point_idx], color='red', linestyle='--', linewidth=2, 
               label=f'Change Point: {dates[change_point_idx].strftime("%Y-%m-%d")}')
    ax.set_title('Brent Oil Price Time Series with Detected Change Point', fontsize=14, fontweight='bold')
    ax.set_xlabel('Date')
    ax.set_ylabel('Price (USD)')
    ax.legend()
    ax.grid(True, alpha=0.3)
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    # Convert to base64
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
    img_buffer.seek(0)
    plots['time_series'] = base64.b64encode(img_buffer.getvalue()).decode()
    plt.close()
    
    # 2. Posterior distribution of change point
    fig, ax = plt.subplots(figsize=(10, 6))
    tau_samples = trace.posterior['tau'].values.flatten()
    ax.hist(tau_samples, bins=50, alpha=0.7, color='skyblue', edgecolor='black')
    ax.axvline(x=change_point_idx, color='red', linestyle='--', linewidth=2, 
               label=f'Median: {change_point_idx}')
    ax.set_title('Posterior Distribution of Change Point Location', fontsize=14, fontweight='bold')
    ax.set_xlabel('Time Index')
    ax.set_ylabel('Frequency')
    ax.legend()
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
    img_buffer.seek(0)
    plots['posterior'] = base64.b64encode(img_buffer.getvalue()).decode()
    plt.close()
    
    # 3. Price distribution before/after change
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    before_change = prices[:change_point_idx]
    after_change = prices[change_point_idx:]
    
    ax1.hist(before_change, bins=30, alpha=0.7, color='lightblue', edgecolor='black', label='Before Change')
    ax1.set_title('Price Distribution Before Change Point', fontweight='bold')
    ax1.set_xlabel('Price (USD)')
    ax1.set_ylabel('Frequency')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    ax2.hist(after_change, bins=30, alpha=0.7, color='lightcoral', edgecolor='black', label='After Change')
    ax2.set_title('Price Distribution After Change Point', fontweight='bold')
    ax2.set_xlabel('Price (USD)')
    ax2.set_ylabel('Frequency')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
    img_buffer.seek(0)
    plots['distributions'] = base64.b64encode(img_buffer.getvalue()).decode()
    plt.close()
    
    return plots

@app.route('/api/events', methods=['GET'])
def get_events():
    """Get event data for correlation analysis"""
    global event_data, oil_data, analysis_results
    
    if event_data is None or oil_data is None:
        return jsonify({'success': False, 'message': 'Both oil price and event data required'}), 400
    
    if analysis_results is None:
        return jsonify({'success': False, 'message': 'Please run analysis first'}), 400
    
    try:
        change_point_date = pd.to_datetime(analysis_results['stats']['change_point_date'])
        
        # Find events around the change point (±30 days)
        window_days = 30
        start_date = change_point_date - pd.Timedelta(days=window_days)
        end_date = change_point_date + pd.Timedelta(days=window_days)
        
        nearby_events = event_data[
            (event_data['Date'] >= start_date) & 
            (event_data['Date'] <= end_date)
        ].copy()
        
        if len(nearby_events) > 0:
            nearby_events['Days_From_Change'] = (nearby_events['Date'] - change_point_date).dt.days
            nearby_events = nearby_events.sort_values('Days_From_Change')
        
        return jsonify({
            'success': True,
            'change_point_date': change_point_date.strftime('%Y-%m-%d'),
            'nearby_events': nearby_events.to_dict('records') if len(nearby_events) > 0 else [],
            'total_events': len(event_data),
            'events_in_window': len(nearby_events),
            'window_days': window_days
        })
        
    except Exception as e:
        logger.error(f"Events error: {str(e)}")
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/api/download_results', methods=['GET'])
def download_results():
    """Download analysis results as CSV"""
    global analysis_results, oil_data
    
    if analysis_results is None:
        return jsonify({'success': False, 'message': 'No analysis results available'}), 400
    
    try:
        # Create results summary
        results_df = pd.DataFrame([analysis_results['stats']])
        
        # Save to CSV
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'analysis_results.csv')
        results_df.to_csv(output_path, index=False)
        
        return send_file(output_path, as_attachment=True, download_name='change_point_analysis_results.csv')
        
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/api/data_status', methods=['GET'])
def get_data_status():
    """Get current data status"""
    return jsonify({
        'oil_data_loaded': oil_data is not None,
        'event_data_loaded': event_data is not None,
        'analysis_completed': analysis_results is not None,
        'oil_data_info': {
            'records': len(oil_data) if oil_data is not None else 0,
            'date_range': {
                'start': oil_data['Date'].min().strftime('%Y-%m-%d') if oil_data is not None else None,
                'end': oil_data['Date'].max().strftime('%Y-%m-%d') if oil_data is not None else None
            }
        } if oil_data is not None else None,
        'event_data_info': {
            'events': len(event_data) if event_data is not None else 0
        } if event_data is not None else None
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug, host='0.0.0.0', port=port) 