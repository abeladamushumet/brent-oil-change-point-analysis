import pymc as pm
import numpy as np
import matplotlib.pyplot as plt
import arviz as az

def build_model(data):
    """
    Builds a Bayesian change point model for Brent oil price data.

    Parameters:
        data (array-like): 1D array of oil prices.

    Returns:
        model (pm.Model): PyMC model.
    """
    n = len(data)
    mean_val = np.mean(data)
    std_val = np.std(data)

    with pm.Model() as model:
        # Prior for change point 
        tau = pm.DiscreteUniform("tau", lower=0, upper=n - 1)

        # Priors for means before and after change
        mu1 = pm.Normal("mu1", mu=mean_val, sigma=std_val)
        mu2 = pm.Normal("mu2", mu=mean_val, sigma=std_val)

        # Shared noise level
        sigma = pm.HalfNormal("sigma", sigma=std_val)

        # Switch between mu1 and mu2 based on tau
        mu = pm.math.switch(np.arange(n) < tau, mu1, mu2)

        # Likelihood
        pm.Normal("obs", mu=mu, sigma=sigma, observed=data)

    return model


def run_inference(model, draws=1000, tune=500, target_accept=0.9):
    """
    Runs MCMC inference using NUTS sampler.

    Parameters:
        model (pm.Model): PyMC model.
        draws (int): Number of samples.
        tune (int): Number of tuning steps.
        target_accept (float): Acceptance probability for NUTS.

    Returns:
        trace (arviz.InferenceData): Inference results.
    """
    with model:
        trace = pm.sample(draws=draws, tune=tune, target_accept=target_accept,
                          chains=2, cores=1, return_inferencedata=True,
                          progressbar=True)
    return trace


def get_change_point(trace):
    """
    Gets the most likely change point index (posterior median of tau).

    Parameters:
        trace (arviz.InferenceData): Sampling trace.

    Returns:
        int: Detected change point index.
    """
    tau_samples = trace.posterior['tau'].values.flatten()
    return int(np.median(tau_samples))


def plot_posterior(trace):
    """
    Plots posterior distributions for key parameters.

    Parameters:
        trace (arviz.InferenceData): Inference result.
    """
    az.plot_posterior(trace, var_names=["tau", "mu1", "mu2"], hdi_prob=0.94)
    plt.tight_layout()
    plt.show()
