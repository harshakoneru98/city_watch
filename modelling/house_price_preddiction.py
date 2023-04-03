import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_squared_error

# load the data


import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import TimeSeriesSplit


data = pd.read_json('../../../Downloads/housing.json')

# load the data
data['issue_date'] = pd.to_datetime(data['issue_date'])
data.set_index('issue_date', inplace=True)


data['valuation'] = data.groupby('zip_code')['valuation'].transform(lambda x: x.fillna(x.mean()))



# generate monthly prices at zip code level
monthly_prices = data.groupby(['zip_code', pd.Grouper(freq='M')])['valuation'].mean().reset_index()
monthly_prices.set_index('issue_date', inplace=True)

# create lagged features
monthly_prices['price_lag1'] = monthly_prices.groupby('zip_code')['valuation'].shift(1)
monthly_prices['price_lag3'] = monthly_prices.groupby('zip_code')['valuation'].shift(3)
monthly_prices['price_lag12'] = monthly_prices.groupby('zip_code')['valuation'].shift(12)




monthly_prices.dropna(inplace=True)


# split the data into training and testing sets using time series split
tscv = TimeSeriesSplit(n_splits=5)
for train_index, test_index in tscv.split(monthly_prices):
    train = monthly_prices.iloc[train_index]
    test = monthly_prices.iloc[test_index]
    # preprocess the data
    train = train.dropna()
    test = test.dropna()
    # preprocess the data
    train_X, train_y = train[['price_lag1', 'price_lag3', 'price_lag12']], train['valuation']
    test_X, test_y = test[['price_lag1', 'price_lag3', 'price_lag12']], test['valuation']

    # fit the model
    model = LinearRegression()
    model.fit(train_X, train_y)

    # make predictions
    y_pred = model.predict(test_X)

    # evaluate the model
    mse = mean_squared_error(test_y, y_pred)
    rmse = np.sqrt(mse)
    print(f"RMSE: {np.log10(rmse)}")

# forecast prices for the next month
last_month = monthly_prices.groupby('zip_code').tail(1)
future_X = last_month[['price_lag1', 'price_lag3', 'price_lag12']].values
future_pred = model.predict(future_X)
print(f"Forecasted price: {future_pred}")






# import pandas as pd
# import numpy as np
# from sklearn.linear_model import LinearRegression
# from sklearn.preprocessing import OneHotEncoder
# from sklearn.compose import ColumnTransformer
# from sklearn.metrics import mean_squared_error

# # load the data
# data = pd.read_csv('housing_data.csv')

# # preprocess the data
# data['needs_recoding'] = data['needs_recoding'].astype(int)
# ct = ColumnTransformer([('encoder', OneHotEncoder(), ['zipcode'])], remainder='passthrough')
# data = ct.fit_transform(data)
# X = data[:,:-1]
# y = data[:,-1]

# # split the data into training and testing sets
# n_samples = X.shape[0]
# n_train = int(0.8 * n_samples)  # use 80% of the data for training
# train_X, test_X = X[:n_train,:], X[n_train:,:]
# train_y, test_y = y[:n_train], y[n_train:]

# # fit the model
# model = LinearRegression()
# model.fit(train_X, train_y)

# # make predictions
# y_pred = model.predict(test_X)

# # evaluate the model
# mse = mean_squared_error(test_y, y_pred)
# rmse = np.sqrt(mse)
# print(f"RMSE: {rmse}")

# # forecast prices for the next month
# future_X = np.zeros((1,X.shape[1]))
# future_X[0,-1] = 1  # set the binary column to 1 for the future data
# future_X[0,:-1] = test_X[0,:-1]  # set the other features to the last observed value
# future_pred = model.predict(future_X)
# print(f"Forecasted price: {future_pred}")


# RMSE: 6.880240614240576
