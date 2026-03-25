// Simple test to verify Event API endpoints

const baseUrl = 'http://localhost:3000/api/events';

// Test GET all events
fetch(baseUrl)
  .then(res => res.json())
  .then(data => {
    console.log('✅ GET /api/events:', data);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
  });

// Test Swagger docs
fetch('http://localhost:3000/api-docs')
  .then(res => res.text())
  .then(() => {
    console.log('✅ Swagger docs available at http://localhost:3000/api-docs');
  })
  .catch(err => {
    console.error('❌ Swagger docs error:', err.message);
  });
