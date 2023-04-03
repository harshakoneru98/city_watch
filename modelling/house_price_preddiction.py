import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_squared_error

# load the data
data = pd.read_csv('housing_data.csv')

# preprocess the data
data['needs_recoding'] = data['needs_recoding'].astype(int)
ct = ColumnTransformer([('encoder', OneHotEncoder(), ['zipcode'])], remainder='passthrough')
data = ct.fit_transform(data)
X = data[:,:-1]
y = data[:,-1]

# split the data into training and testing sets
n_samples = X.shape[0]
n_train = int(0.8 * n_samples)  # use 80% of the data for training
train_X, test_X = X[:n_train,:], X[n_train:,:]
train_y, test_y = y[:n_train], y[n_train:]

# fit the model
model = LinearRegression()
model.fit(train_X, train_y)

# make predictions
y_pred = model.predict(test_X)

# evaluate the model
mse = mean_squared_error(test_y, y_pred)
rmse = np.sqrt(mse)
print(f"RMSE: {rmse}")

# forecast prices for the next month
future_X = np.zeros((1,X.shape[1]))
future_X[0,-1] = 1  # set the binary column to 1 for the future data
future_X[0,:-1] = test_X[0,:-1]  # set the other features to the last observed value
future_pred = model.predict(future_X)
print(f"Forecasted price: {future_pred}")
