CREATE TABLE tourists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    aadhaar_hash VARCHAR(64) UNIQUE NOT NULL,
    blockchain_id VARCHAR(255) UNIQUE,
    emergency_contact VARCHAR(255),
    entry_point VARCHAR(255),
    trip_duration VARCHAR(50),
    current_latitude NUMERIC(10, 8),
    current_longitude NUMERIC(11, 8),
    status VARCHAR(50) DEFAULT 'Safe' NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    tourist_id INTEGER REFERENCES tourists(id) ON DELETE CASCADE NOT NULL,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    transaction_hash VARCHAR(66) UNIQUE
);
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    tourist_id INTEGER REFERENCES tourists(id) ON DELETE CASCADE NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);