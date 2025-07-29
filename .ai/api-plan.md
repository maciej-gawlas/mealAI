# REST API Plan

## 1. Resources

- **User** (`auth.users` via Supabase Auth)
- **Preference** (`preferences`)
- **UserPreference** (`user_preferences`)
- **Recipe** (`recipes`)
- **AI Generation** (virtual resource for generating recipes via OpenAI)

## 2. Endpoints

### 2.1 Authentication

#### Register a new user

- Method: POST
- URL: /auth/register
- Description: Create a new user account
- Request JSON:

```json
{
  "email": "user@example.com",
  "password": "P@ssw0rd!"
}
```

- Response JSON (201 Created):

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "accessToken": "jwt-token"
}
```

- Errors:
  - 400 Bad Request if email or password invalid
  - 409 Conflict if email already exists

#### Login

- Method: POST
- URL: /auth/login
- Description: Authenticate user and return token
- Request JSON:

```json
{
  "email": "user@example.com",
  "password": "P@ssw0rd!"
}
```

- Response JSON (200 OK):

```json
{
  "user": { "id": "uuid", "email": "user@example.com" },
  "accessToken": "jwt-token"
}
```

- Errors:
  - 400 Invalid credentials

### 2.2 Preferences

#### Get all preferences

- Method: GET
- URL: /preferences
- Description: Retrieve supported dietary preferences
- Response JSON (200 OK):

```json
{
  "data": [
    { "id": "uuid1", "name": "Vegan" },
    { "id": "uuid2", "name": "Vegetarian" },
    { "id": "uuid3", "name": "Gluten-Free" },
    { "id": "uuid4", "name": "Keto" },
    { "id": "uuid5", "name": "Paleo" }
  ]
}
```

#### Get user preferences

- Method: GET
- URL: /users/me/preferences
- Description: Retrieve current user's preference mappings
- Headers: `Authorization: Bearer <token>`
- Response JSON (200 OK):

```json
{
  "data": [
    { "user_id": "user-uuid", "preference_id": "uuid1", "name": "Vegan" },
    { "user_id": "user-uuid", "preference_id": "uuid3", "name": "Keto" }
  ]
}
```

#### Update user preferences

- Method: PUT
- URL: /users/me/preferences
- Description: Overwrite current user's preference mappings
- Request JSON:

```json
{
  "preferences": ["uuid1", "uuid2"]
}
```

- Response JSON (200 OK):

```json
{
  "data": [
    { "user_id": "user-uuid", "preference_id": "uuid1" },
    { "user_id": "user-uuid", "preference_id": "uuid2" }
  ]
}
```

- Errors: 400 if invalid preference IDs

### 2.3 Recipes

#### List recipes

- Method: GET
- URL: /recipes
- Description: List user's recipes
- Query Params:
  - page (integer, default 1)
  - limit (integer, default 20)
  - sort (e.g., created_at desc)
  - ai_generated (boolean)
- Headers: Authorization
- Response JSON (200 OK):

```json
{
  "meta": { "page": 1, "limit": 20, "total": 42 },
  "data": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "name": "Salad",
      "ingredients": "Lettuce, Tomato, Cucumber",
      "instructions": "Chop veggies and mix",
      "is_ai_generated": false,
      "created_at": "2025-07-23T12:34:56Z",
      "updated_at": "2025-07-23T12:34:56Z"
    }
  ]
}
```

#### Get recipe details

- Method: GET
- URL: /recipes/{id}
- Headers: Authorization
- Response JSON (200 OK):

```json
{
  "id": "recipe-uuid",
  "user_id": "user-uuid",
  "name": "Salad",
  "ingredients": "Lettuce, Tomato, Cucumber",
  "instructions": "Chop veggies and mix",
  "is_ai_generated": false,
  "created_at": "2025-07-23T12:34:56Z",
  "updated_at": "2025-07-23T12:34:56Z"
}
```

- Errors: 404 if not found or unauthorized

#### Create recipe (manual)

- Method: POST
- URL: /recipes
- Headers: Authorization
- Request JSON:

```json
{
  "name": "My Dish",
  "ingredients": "Chicken, Rice, Spices",
  "instructions": "Cook rice and chicken, then season",
  "is_ai_generated": false
}
```

- Response JSON (201 Created):

```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "name": "My Dish",
  "ingredients": "Chicken, Rice, Spices",
  "instructions": "Cook rice and chicken, then season",
  "is_ai_generated": false,
  "created_at": "2025-07-23T12:34:56Z",
  "updated_at": "2025-07-23T12:34:56Z"
}
```

- Validation:
  - name, ingredients, instructions required
- Errors: 400 Bad Request

#### Delete recipe

- Method: DELETE
- URL: /recipes/{id}
- Headers: Authorization
- Response: 204 No Content
- Errors: 404 if not found or unauthorized

### 2.4 AI Generation

#### Generate a recipe via AI

- Method: POST
- URL: /recipes/generate
- Headers: Authorization: Bearer <token>
- Request JSON:

```json
{
  "prompt": "quick vegan lunch",
  "preferences": ["uuid1", "uuid2"]
}
```

- Response JSON (202 Accepted):

```json
{
  "recipe": {
    "name": "Vegan Buddha Bowl",
    "ingredients": "Quinoa, Chickpeas, Avocado, Spinach, Tahini Dressing",
    "instructions": "Cook quinoa according to package instructions, roast chickpeas until crispy, assemble bowl with quinoa, chickpeas, sliced avocado and spinach, then drizzle with tahini dressing."
  },
  "disclaimer": "AI-generated content may contain allergens and inaccuracies. Please verify ingredient compatibility before use."
}
```

- Errors:
  - 400 Bad Request if prompt missing or invalid
  - 503 Service Unavailable if AI API fails
  - 504 Gateway Timeout if external API slow to respond

## 3. Authentication & Authorization

- Use JWT tokens issued by Supabase Auth
- Protect all `/users/*` and `/recipes*` endpoints
- Validate token on each request and extract `user_id`
- Enforce Row-Level Security in Postgres: each query includes `WHERE user_id = auth.uid()`

## 4. Validation & Business Logic

### Validation Rules

- **Registration**: password min 6 chars, 1 digit, 1 special character
- **Email**: valid email format, unique
- **Recipe**: name, ingredients, instructions non-empty
- **Preferences**: array of valid preference IDs

### Business Logic Implementation

- On recipe generation, merge user profile preferences as defaults
- Save AI-generated recipes only when user confirms via separate POST to `/recipes`
- Provide retry mechanism on AI errors
- Delete recipe confirmation handled client-side; API requires direct DELETE call
- Paginate and filter recipe lists by query parameters
