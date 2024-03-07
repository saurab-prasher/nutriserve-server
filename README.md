## Team Name : WebDriver 
## Assignment Name: : Project Phase 1- Project React part 1
## Team Members:
    * Saurabh Prashar
    * Chandrika Venu Killada
    * Siddhesh Satish Nikam
    
# Server side APIs information

<!-- Password for user1 -->
<!-- username1 -->

# User Management API

Endpoints:
POST /users/register - Register a new user.
POST /users/login - Authenticate a user.
GET /users/me - Retrieve the current user's profile.
PUT /users/me - Update the current user's profile.

# Meal Subscription API

Endpoints:
GET /meals - List all available meals.
POST /subscriptions - Create a new meal subscription.
GET /subscriptions/{userId} - Retrieve a user's current subscription details.
PUT /subscriptions/{userId} - Update a user's subscription details.
DELETE /subscriptions/{userId} - Cancel a user's subscription.

# Meal Planning API

Endpoints:
POST /meal-plans - Generate a new meal plan based on user preferences.
GET /meal-plans/{userId} - Retrieve the current meal plan for the user.
PUT /meal-plans/{userId} - Update the meal plan for the user (e.g., change meals, adjust preferences).

# Orders and Delivery API

Endpoints:
POST /orders - Place a new order for meals.
GET /orders/{userId} - Retrieve a user's past orders.
POST /deliveries - Schedule a delivery.
PUT /deliveries/{deliveryId} - Update delivery details (e.g., change time or address).
GET /deliveries/{userId} - Get the schedule of upcoming deliveries for the user.

# Feedback and Reviews API

Endpoints:
POST /reviews - Submit a new review for a meal.
GET /reviews/{mealId} - Get all reviews for a meal.
PUT /reviews/{reviewId} - Update a review.
DELETE /reviews/{reviewId} - Delete a review.

# Authentication and Authorization

Implement token-based authentication (e.g., JWT) for securing the API.
Validate requests to ensure that users can only access and modify their own data.
Additional Considerations:
Rate Limiting: Implement rate limiting to prevent abuse of the API.
Validation: Ensure all input data is validated to prevent injection attacks and ensure data integrity.
Error Handling: Implement comprehensive error handling for clear, useful error messages.
Documentation: Provide detailed API documentation for developers, including endpoints, request/response formats, and example use cases.
