# Event CRUD API Documentation

## Overview
This document describes the Event management CRUD endpoints for the Dino Trip Planner backend. All endpoints are automatically documented in Swagger UI.

## Base URL
```
http://localhost:3000/api/events
```

## Access Swagger Documentation
**URL:** `http://localhost:3000/api-docs`

Open this URL in your browser to view an interactive Swagger UI with all endpoints and request/response schemas.

---

## Endpoints

### 1. Get All Events
**GET** `/api/events`

Get a list of all events with optional filtering.

#### Query Parameters:
- `status` (optional): Filter by event status - `upcoming`, `ongoing`, `completed`, `cancelled`
- `category` (optional): Filter by category - `concert`, `festival`, `exhibition`, `sport`, `market`, `workshop`, `religious`, `food`, `other`
- `limit` (optional, default: 10): Maximum number of results
- `page` (optional, default: 1): Page number for pagination

#### Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "เทศกาลไหมและพาแลงขอนแก่น 2568",
      "slug": "festival-silk-khonkaen-2568",
      "category": "festival",
      "description": "...",
      "status": "upcoming",
      "schedule": {
        "startDate": "2026-10-01T00:00:00Z",
        "endDate": "2026-10-31T23:59:59Z",
        "timezone": "Asia/Bangkok"
      },
      "createdAt": "2026-03-26T10:00:00Z",
      "updatedAt": "2026-03-26T10:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

#### Example Requests:
```bash
# Get all events
GET http://localhost:3000/api/events

# Get upcoming events with pagination
GET http://localhost:3000/api/events?status=upcoming&limit=5&page=1

# Get festival events
GET http://localhost:3000/api/events?category=festival
```

---

### 2. Get Event by ID
**GET** `/api/events/{id}`

Get detailed information about a specific event.

#### Path Parameters:
- `id` (required): MongoDB ObjectId of the event

#### Response:
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "เทศกาลไหมและพาแลงขอนแก่น 2568",
    "slug": "festival-silk-khonkaen-2568",
    "category": "festival",
    "description": "งานเทศกาลไหมพื้นบ้านของขอนแก่น",
    "coverImage": "https://...",
    "images": ["https://...", "https://..."],
    "venues": [
      {
        "placeId": "507f1f77bcf86cd799439011",
        "venueName": "เวทีกลาง",
        "address": "...",
        "location": {
          "lat": 16.4407,
          "lng": 102.8363
        }
      }
    ],
    "schedule": {
      "startDate": "2026-10-01T00:00:00Z",
      "endDate": "2026-10-31T23:59:59Z",
      "sessions": [
        {
          "date": "2026-10-15",
          "startTime": "18:00",
          "endTime": "23:00",
          "note": "รอบเปิดตัว"
        }
      ],
      "timezone": "Asia/Bangkok"
    },
    "admission": {
      "isFree": false,
      "tickets": [
        {
          "type": "บัตรทั่วไป",
          "price": 300,
          "currency": "THB",
          "available": true
        }
      ],
      "ticketUrl": "https://..."
    },
    "organizer": {
      "name": "สำนักวัฒนท่องเที่ยWe",
      "contactPhone": "043-221-341",
      "contactEmail": "info@...",
      "website": "https://...",
      "socialMedia": {
        "facebook": "...",
        "instagram": "..."
      }
    },
    "tags": ["annual", "family", "free-entry"],
    "suitableFor": {
      "solo": true,
      "couple": true,
      "family": true,
      "group": true
    },
    "status": "upcoming",
    "metadata": {
      "isPublished": true,
      "isFeatured": true,
      "source": "admin"
    },
    "createdAt": "2026-03-26T10:00:00Z",
    "updatedAt": "2026-03-26T10:00:00Z"
  }
}
```

#### Example Request:
```bash
GET http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1
```

---

### 3. Create New Event
**POST** `/api/events`

Create a new event.

#### Request Body:
```json
{
  "name": "เทศกาลไหมและพาแลงขอนแก่น 2568",
  "slug": "festival-silk-khonkaen-2568",
  "category": "festival",
  "description": "งานเทศกาลไหมพื้นบ้านของขอนแก่น",
  "coverImage": "https://...",
  "images": ["https://...", "https://..."],
  "venues": [
    {
      "placeId": "507f1f77bcf86cd799439011",
      "google_place_id": "ChIJv...",
      "venueName": "เวทีกลาง",
      "address": "ชาติลดาวัน ต.ในเมือง อ.เมือง จ.ขอนแก่น",
      "location": {
        "lat": 16.4407,
        "lng": 102.8363
      }
    }
  ],
  "schedule": {
    "startDate": "2026-10-01T00:00:00Z",
    "endDate": "2026-10-31T23:59:59Z",
    "sessions": [
      {
        "date": "2026-10-15",
        "startTime": "18:00",
        "endTime": "23:00",
        "note": "รอบเปิดตัว"
      }
    ],
    "timezone": "Asia/Bangkok"
  },
  "admission": {
    "isFree": false,
    "tickets": [
      {
        "type": "บัตรทั่วไป",
        "price": 300,
        "currency": "THB",
        "available": true
      }
    ],
    "ticketUrl": "https://...",
    "note": "ราคาอื่นๆตามหมวดหมู่"
  },
  "organizer": {
    "name": "สำนักวัฒนท่องเที่ยว",
    "contactPhone": "043-221-341",
    "contactEmail": "info@khonkaen.go.th",
    "website": "https://...",
    "socialMedia": {
      "facebook": "...",
      "instagram": "..."
    }
  },
  "tags": ["annual", "family", "free-entry"],
  "suitableFor": {
    "solo": true,
    "couple": true,
    "family": true,
    "group": true
  },
  "status": "upcoming",
  "metadata": {
    "isPublished": true,
    "isFeatured": true,
    "source": "admin",
    "sourceUrl": "https://..."
  }
}
```

#### Response:
`201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    ...
  }
}
```

#### Example Request:
```bash
POST http://localhost:3000/api/events
Content-Type: application/json

{
  "name": "เทศกาลไหม 2568",
  "category": "festival",
  "schedule": {
    "startDate": "2026-10-01T00:00:00Z",
    "endDate": "2026-10-31T23:59:59Z"
  }
}
```

---

### 4. Update Event
**PUT** `/api/events/{id}`

Update an existing event. You can update partial fields (PATCH-like behavior).

#### Path Parameters:
- `id` (required): MongoDB ObjectId of the event

#### Request Body:
Any fields from the Event schema can be updated. Only modified fields need to be sent.

#### Response:
`200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    ...updated fields...
  }
}
```

#### Example Request:
```bash
PUT http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1
Content-Type: application/json

{
  "status": "ongoing",
  "description": "อัปเดตรายละเอียด"
}
```

---

### 5. Delete Event
**DELETE** `/api/events/{id}`

Delete an event from the database.

#### Path Parameters:
- `id` (required): MongoDB ObjectId of the event

#### Response:
`200 OK`
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

#### Example Request:
```bash
DELETE http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1
```

---

### 6. Get Events by Status
**GET** `/api/events/by-status/{status}`

Get all events filtered by a specific status.

#### Path Parameters:
- `status` (required): One of `upcoming`, `ongoing`, `completed`, `cancelled`

#### Response:
```json
{
  "success": true,
  "data": [/* array of events */]
}
```

#### Example Request:
```bash
GET http://localhost:3000/api/events/by-status/upcoming
```

---

### 7. Get Events by Category
**GET** `/api/events/by-category/{category}`

Get all events filtered by a specific category.

#### Path Parameters:
- `category` (required): One of `concert`, `festival`, `exhibition`, `sport`, `market`, `workshop`, `religious`, `food`, `other`

#### Response:
```json
{
  "success": true,
  "data": [/* array of events */]
}
```

#### Example Request:
```bash
GET http://localhost:3000/api/events/by-category/festival
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Required fields: name, schedule.startDate, schedule.endDate"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Event not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal Server Error"
}
```

---

## Data Types & Validation

### Event Status
- `upcoming` - งานที่กำลังจะมาถึง
- `ongoing` - งานที่กำลังเกิดขึ้น
- `completed` - งานที่เสร็จสิ้นแล้ว
- `cancelled` - งานที่ยกเลิก

### Categories
- `concert` - คอนเสิร์ต
- `festival` - เทศกาล
- `exhibition` - นิทรรศการ
- `sport` - กีฬา
- `market` - ตลาด
- `workshop` - การอบรม
- `religious` - ศาสนา
- `food` - อาหาร
- `other` - อื่นๆ

### Schedule Requirements
- `startDate` (required): ISO 8601 format
- `endDate` (required): ISO 8601 format
- `endDate` must be >= `startDate`

---

## Usage Examples

### Using JavaScript/Fetch
```javascript
// Get all events
const response = await fetch('http://localhost:3000/api/events');
const events = await response.json();

// Create new event
const newEvent = await fetch('http://localhost:3000/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Festival',
    category: 'festival',
    schedule: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString()
    }
  })
});

// Update event
const updated = await fetch('http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'ongoing' })
});

// Delete event
const deleted = await fetch('http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1', {
  method: 'DELETE'
});
```

### Using cURL
```bash
# Get all events
curl http://localhost:3000/api/events

# Create event
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Festival",
    "category": "festival",
    "schedule": {
      "startDate": "2026-10-01T00:00:00Z",
      "endDate": "2026-10-31T23:59:59Z"
    }
  }'

# Update event
curl -X PUT http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1 \
  -H "Content-Type: application/json" \
  -d '{"status": "ongoing"}'

# Delete event
curl -X DELETE http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1
```

---

## Notes

- All timestamps are in UTC (ISO 8601 format)
- Slug is automatically generated from name if not provided
- Slug must be unique across all events
- Indices are created on: `name`, `category`, `status`, `schedule.startDate`, `schedule.endDate`
- Pagination limit max is 100 (recommended)
- All responses use the same success/data/error format
