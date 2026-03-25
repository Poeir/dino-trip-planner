const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dino Trip Planner - Places & Events API",
      version: "1.0.0",
      description: "API documentation for Dino Trip Planner Backend",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
    ],
    components: {
      schemas: {
        Event: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "MongoDB Object ID",
            },
            name: {
              type: "string",
              description: "ชื่อของงาน",
            },
            slug: {
              type: "string",
              description: "URL-friendly identifier",
            },
            category: {
              type: "string",
              enum: [
                "concert",
                "festival",
                "exhibition",
                "sport",
                "market",
                "workshop",
                "religious",
                "food",
                "other",
              ],
              description: "หมวดหมู่ของงาน",
            },
            description: {
              type: "string",
              description: "คำอธิบายงาน",
            },
            coverImage: {
              type: "string",
              description: "URL ของรูปภาพปกหลัก",
            },
            images: {
              type: "array",
              items: {
                type: "string",
              },
              description: "อาร์เรย์ URL ของรูปภาพเพิ่มเติม",
            },
            venues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  placeId: {
                    type: "string",
                    description: "MongoDB ObjectId ของสถานที่",
                  },
                  google_place_id: {
                    type: "string",
                    description: "Google Places API ID",
                  },
                  venueName: {
                    type: "string",
                    description: "ชื่อเรียกของเวทีเช่น เวทีกลาง โซน A",
                  },
                  address: {
                    type: "string",
                    description: "ที่อยู่",
                  },
                  location: {
                    type: "object",
                    properties: {
                      lat: {
                        type: "number",
                        description: "ละติจูด",
                      },
                      lng: {
                        type: "number",
                        description: "ลองจิจูด",
                      },
                    },
                  },
                },
              },
              description: "รายการสถานที่จัดงาน",
            },
            schedule: {
              type: "object",
              properties: {
                startDate: {
                  type: "string",
                  format: "date-time",
                  description: "วันเริ่มงาน",
                },
                endDate: {
                  type: "string",
                  format: "date-time",
                  description: "วันสิ้นสุดงาน",
                },
                sessions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: {
                        type: "string",
                        format: "date",
                      },
                      startTime: {
                        type: "string",
                        description: "เวลาเริ่ม เช่น 18:00",
                      },
                      endTime: {
                        type: "string",
                        description: "เวลาสิ้นสุด เช่น 23:00",
                      },
                      note: {
                        type: "string",
                      },
                    },
                  },
                },
                timezone: {
                  type: "string",
                  default: "Asia/Bangkok",
                },
              },
              required: ["startDate", "endDate"],
            },
            admission: {
              type: "object",
              properties: {
                isFree: {
                  type: "boolean",
                  description: "ว่างเข้าฟรีหรือไม่",
                },
                tickets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        description: "ประเภทบัตร เช่น บัตรทั่วไป VIP เด็ก",
                      },
                      price: {
                        type: "number",
                        description: "ราคา",
                      },
                      currency: {
                        type: "string",
                        default: "THB",
                      },
                      available: {
                        type: "boolean",
                      },
                    },
                  },
                },
                ticketUrl: {
                  type: "string",
                  description: "URL ขายบัตร",
                },
                note: {
                  type: "string",
                },
              },
            },
            organizer: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "ชื่อผู้จัดงาน",
                },
                contactPhone: {
                  type: "string",
                },
                contactEmail: {
                  type: "string",
                },
                website: {
                  type: "string",
                },
                socialMedia: {
                  type: "object",
                  properties: {
                    facebook: {
                      type: "string",
                    },
                    instagram: {
                      type: "string",
                    },
                    line: {
                      type: "string",
                    },
                  },
                },
              },
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: 'เช่น ["annual", "family", "free-entry", "night-event"]',
            },
            suitableFor: {
              type: "object",
              properties: {
                solo: {
                  type: "boolean",
                },
                couple: {
                  type: "boolean",
                },
                family: {
                  type: "boolean",
                },
                group: {
                  type: "boolean",
                },
              },
            },
            status: {
              type: "string",
              enum: ["upcoming", "ongoing", "completed", "cancelled"],
              default: "upcoming",
              description: "สถานะของงาน",
            },
            metadata: {
              type: "object",
              properties: {
                isPublished: {
                  type: "boolean",
                  default: false,
                },
                isFeatured: {
                  type: "boolean",
                  default: false,
                },
                source: {
                  type: "string",
                  description: "แหล่งข้อมูล admin scraper user_submit",
                },
                sourceUrl: {
                  type: "string",
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        EventInput: {
          type: "object",
          required: ["name", "schedule"],
          properties: {
            name: {
              type: "string",
              description: "ชื่อของงาน",
            },
            slug: {
              type: "string",
              description: "URL-friendly identifier (auto-generated if not provided)",
            },
            category: {
              type: "string",
              enum: [
                "concert",
                "festival",
                "exhibition",
                "sport",
                "market",
                "workshop",
                "religious",
                "food",
                "other",
              ],
            },
            description: {
              type: "string",
            },
            coverImage: {
              type: "string",
            },
            images: {
              type: "array",
              items: {
                type: "string",
              },
            },
            venues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  placeId: {
                    type: "string",
                  },
                  google_place_id: {
                    type: "string",
                  },
                  venueName: {
                    type: "string",
                  },
                  address: {
                    type: "string",
                  },
                  location: {
                    type: "object",
                    properties: {
                      lat: {
                        type: "number",
                      },
                      lng: {
                        type: "number",
                      },
                    },
                  },
                },
              },
            },
            schedule: {
              type: "object",
              required: ["startDate", "endDate"],
              properties: {
                startDate: {
                  type: "string",
                  format: "date-time",
                },
                endDate: {
                  type: "string",
                  format: "date-time",
                },
                sessions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: {
                        type: "string",
                        format: "date",
                      },
                      startTime: {
                        type: "string",
                      },
                      endTime: {
                        type: "string",
                      },
                      note: {
                        type: "string",
                      },
                    },
                  },
                },
                timezone: {
                  type: "string",
                  default: "Asia/Bangkok",
                },
              },
            },
            admission: {
              type: "object",
              properties: {
                isFree: {
                  type: "boolean",
                  default: false,
                },
                tickets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                      },
                      price: {
                        type: "number",
                      },
                      currency: {
                        type: "string",
                        default: "THB",
                      },
                      available: {
                        type: "boolean",
                      },
                    },
                  },
                },
                ticketUrl: {
                  type: "string",
                },
                note: {
                  type: "string",
                },
              },
            },
            organizer: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                contactPhone: {
                  type: "string",
                },
                contactEmail: {
                  type: "string",
                },
                website: {
                  type: "string",
                },
                socialMedia: {
                  type: "object",
                  properties: {
                    facebook: {
                      type: "string",
                    },
                    instagram: {
                      type: "string",
                    },
                    line: {
                      type: "string",
                    },
                  },
                },
              },
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
            },
            suitableFor: {
              type: "object",
              properties: {
                solo: {
                  type: "boolean",
                },
                couple: {
                  type: "boolean",
                },
                family: {
                  type: "boolean",
                },
                group: {
                  type: "boolean",
                },
              },
            },
            status: {
              type: "string",
              enum: ["upcoming", "ongoing", "completed", "cancelled"],
              default: "upcoming",
            },
            metadata: {
              type: "object",
              properties: {
                isPublished: {
                  type: "boolean",
                  default: false,
                },
                isFeatured: {
                  type: "boolean",
                  default: false,
                },
                source: {
                  type: "string",
                },
                sourceUrl: {
                  type: "string",
                },
              },
            },
          },
        },
        Place: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            location: {
              type: "object",
              properties: {
                lat: {
                  type: "number",
                },
                lng: {
                  type: "number",
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    "./routes/event-routes/*.js",
    "./routes/place-routes/*.js",
    "./routes/google-api-routes/*.js",
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
