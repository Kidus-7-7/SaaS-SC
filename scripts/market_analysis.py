import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import json
import sys
import os
from datetime import datetime, timedelta

def load_data(file_path):
    """Load and preprocess the property data."""
    df = pd.read_csv(file_path)
    df['date'] = pd.to_datetime(df['date'])
    return df

def prepare_features(df):
    """Prepare features for the model."""
    # Create time-based features
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month
    df['day_of_week'] = df['date'].dt.dayofweek
    
    # Calculate rolling statistics
    df['rolling_mean_price'] = df['price'].rolling(window=30).mean()
    df['rolling_std_price'] = df['price'].rolling(window=30).std()
    
    # Fill missing values
    df = df.fillna(method='ffill')
    
    return df

def train_model(df):
    """Train the random forest model."""
    features = ['year', 'month', 'day_of_week', 'rolling_mean_price', 'rolling_std_price']
    X = df[features]
    y = df['price']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train the model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test_scaled)
    
    # Calculate metrics
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    return model, scaler, mse, r2

def generate_future_predictions(model, scaler, last_date, num_months=6):
    """Generate predictions for future months."""
    future_dates = pd.date_range(start=last_date, periods=num_months + 1, freq='M')[1:]
    future_data = []
    
    for date in future_dates:
        features = {
            'year': date.year,
            'month': date.month,
            'day_of_week': date.dayofweek,
            # Use the last known values for rolling statistics
            'rolling_mean_price': df['rolling_mean_price'].iloc[-1],
            'rolling_std_price': df['rolling_std_price'].iloc[-1]
        }
        future_data.append(features)
    
    future_df = pd.DataFrame(future_data)
    future_scaled = scaler.transform(future_df)
    predictions = model.predict(future_scaled)
    
    return list(zip(future_dates, predictions))

def calculate_market_metrics(df, predictions):
    """Calculate various market metrics."""
    current_price = df['price'].iloc[-1]
    avg_price = df['price'].mean()
    price_change = ((predictions[0][1] - current_price) / current_price) * 100
    volatility = df['price'].std() / avg_price * 100
    
    return {
        'average_price': float(avg_price),
        'price_change': float(price_change),
        'volatility': float(volatility),
        'prediction_confidence': float(r2 * 100)
    }

if __name__ == "__main__":
    try:
        # Load and prepare data
        data_path = sys.argv[1] if len(sys.argv) > 1 else "data/property_data.csv"
        df = load_data(data_path)
        df = prepare_features(df)
        
        # Train model
        model, scaler, mse, r2 = train_model(df)
        
        # Generate predictions
        last_date = df['date'].max()
        future_predictions = generate_future_predictions(model, scaler, last_date)
        
        # Calculate metrics
        metrics = calculate_market_metrics(df, future_predictions)
        
        # Prepare output
        result = {
            'predictions': [
                {'date': date.strftime('%Y-%m-%d'), 'price': float(price)}
                for date, price in future_predictions
            ],
            'metrics': metrics
        }
        
        # Write results to file
        output_path = 'market_analysis_results.json'
        with open(output_path, 'w') as f:
            json.dump(result, f, indent=2)
        
        print(f"Analysis completed successfully. Results written to {output_path}")
        sys.exit(0)
        
    except Exception as e:
        print(f"Error during market analysis: {str(e)}", file=sys.stderr)
        sys.exit(1)
