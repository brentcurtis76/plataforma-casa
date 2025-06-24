export default function SimplePage() {
  return (
    <html>
      <head>
        <title>Simple Test</title>
      </head>
      <body>
        <h1>Simple Test Page Working</h1>
        <p>Server is running on port 3001</p>
        <p>Time: {new Date().toISOString()}</p>
      </body>
    </html>
  )
}