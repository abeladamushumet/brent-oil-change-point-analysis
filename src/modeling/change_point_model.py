import pymc as pm
import numpy as np
import matplotlib.pyplot as plt

def build_model(data):
    """
    Builds a Bayesian change point model for Brent oil price data.

    Parameters:
    - data: A numpy array or list of oil prices

    Returns:
    - model: a compiled PyMC3 model
    """
    n = len(data)
    with pm.Model() as model:
        # Change point (somewhere in the middle of the series)
        tau = pm.DiscreteUniform('tau', lower=0, upper=n)

        # Parameters before and after the change point
        mu1 = pm.Normal('mu1', mu=np.mean(data), sigma=np.std(data))
        mu2 = pm.Normal('mu2', mu=np.mean(data), sigma=np.std(data))
        sigma = pm.HalfNormal('sigma', sigma=1)

        # Switch based on tau
        mu = pm.math.switch(tau >= np.arange(n), mu1, mu2)

        # Likelihood
        obs = pm.Normal('obs', mu=mu, sigma=sigma, observed=data)

    return model

def run_inference(model, draws=2000, tune=1000, target_accept=0.95):
    """
    Runs MCMC sampling using NUTS for the given model.

    Parameters:
    - model: a PyMC3 model
    - draws: total number of MCMC samples
    - tune: number of tuning steps
    - target_accept: acceptance rate for NUTS

    Returns:
    - trace: the sampling trace
    """
    with model:
        trace = pm.sample(draws=draws, tune=tune, target_accept=target_accept, return_inferencedata=True)
    return trace

def get_change_point(trace):
    """
    Extracts the most likely change point from the trace.

    Parameters:
    - trace: the MCMC sampling result

    Returns:
    - change_point_index: index of detected change point (integer)
    """
    tau_samples = trace.posterior['tau'].values.flatten()
    change_point_index = int(np.median(tau_samples))
    return change_point_index

def plot_posterior(trace):
    """
    Plots the posterior distributions of model parameters.

    Parameters:
    - trace: the sampling trace (InferenceData object)
    """
    pm.plot_posterior(trace, var_names=["tau", "mu1", "mu2"])
    plt.tight_layout()
    plt.show()