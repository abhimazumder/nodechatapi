<h1>Chat API</h1>

<h2>Endpoints</h2>

<h3>1. Sign Up</h3>
<p>Method: POST</p>
<p>Endpoint: <code>/auth/signup</code></p>
<p>Request Headers:
<pre><code>
Content-Type: application/json
</code></pre>
</p>
<p>Expected Request Data:
<pre><code>
{
  "name": "string",
  "email": "string",
  "password": "string"
}
</code></pre>
</p>
<p>Success Response:
<pre><code>
{
  "access_token": "JWT",
  "refresh_token": "JWT"
}
</code></pre>
</p>

<h3>2. Log In</h3>
<p>Method: POST</p>
<p>Endpoint: <code>/auth/login</code></p>
<p>Request Headers:
<pre><code>
Content-Type: application/json
</code></pre>
</p>
<p>Expected Request Data:
<pre><code>
{
  "email": "string",
  "password": "string"
}
</code></pre>
</p>
<p>Success Response:
<pre><code>
{
  "access_token": "JWT",
  "refresh_token": "JWT"
}
</code></pre>
</p>

<h3>3. Refresh Token</h3>
<p>Method: POST</p>
<p>Endpoint: <code>/auth/refresh</code></p>
<p>Request Headers:
<pre><code>
Content-Type: application/json
</code></pre>
</p>
<p>Expected Request Data:
<pre><code>
{
  "refresh_token": "JWT"
}
</code></pre>
</p>
<p>Success Response:
<pre><code>
{
  "access_token": "JWT",
  "refresh_token": "JWT"
}
</code></pre>
</p>

<h3>4. Update User Name</h3>
<p>Method: PUT</p>
<p>Endpoint: <code>/user/name</code></p>
<p>Request Headers:
<pre><code>
Content-Type: application/json
Authorization: Bearer JWT
</code></pre>
</p>
<p>Expected Request Data:
<pre><code>
{
  "name": "string"
}
</code></pre>
</p>
<p>Success Response: OK</p>

<h3>5. Update User Profile Picture</h3>
<p>Method: POST</p>
<p>Endpoint: <code>/user/profile-picture</code></p>
<p>Request Headers:
<pre><code>
Content-Type: multipart/form-data;
Authorization: Bearer JWT
</code></pre>
</p>
<p>Expected Request Data:
<pre><code>
{
  "file": "An image"
}
</code></pre>
</p>
<p>Success Response: OK</p>

<h3>6. Update User Password</h3>
<p>Method: PUT</p>
<p>Endpoint: <code>/user/password</code></p>
<p>Request Headers:
<pre><code>
Content-Type: application/json
Authorization: Bearer JWT
</code></pre>
</p>
<p>Expected Request Data:
<pre><code>
{
  "password": "string"
}
</code></pre>
</p>
<p>Success Response: OK</p>

<h3>7. Get User by Email</h3>
<p>Method: GET</p>
<p>Endpoint: <code>/user/:email</code></p>
<p>Request Headers:
<pre><code>
Content-Type: application/json
Authorization: Bearer JWT
</code></pre>
</p>
<p>Expected Request Data: {}</p>
<p>Success Response:
<pre><code>
{
  "email": "string",
  "name": "string",
  "profilePicture": "string"
}
</code></pre>
</p>
