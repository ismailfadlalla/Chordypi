# Railway Deployment Test Script
# Run this after Railway deployment completes

$separator = "=" * 80

Write-Host $separator -ForegroundColor Cyan
Write-Host "TESTING RAILWAY DEPLOYMENT" -ForegroundColor Cyan
Write-Host $separator -ForegroundColor Cyan
Write-Host ""

$RAILWAY_URL = "https://chordypi-production.up.railway.app"

# Test 1: Health Check
Write-Host "Test 1: Health Check Endpoint" -ForegroundColor Yellow
Write-Host "URL: $RAILWAY_URL/api/health" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$RAILWAY_URL/api/health" -Method Get
    Write-Host "PASS: Health endpoint responding" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "FAIL: Health endpoint not responding" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Featured Songs
Write-Host "Test 2: Featured Songs Endpoint" -ForegroundColor Yellow
Write-Host "URL: $RAILWAY_URL/api/featured-songs" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$RAILWAY_URL/api/featured-songs" -Method Get
    $count = $response.Length
    Write-Host "PASS: Got $count featured songs" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Featured songs endpoint error" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Search Endpoint
Write-Host "Test 3: YouTube Search Endpoint" -ForegroundColor Yellow
Write-Host "URL: $RAILWAY_URL/api/search-songs" -ForegroundColor Gray
try {
    $body = @{query="wonderwall"} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$RAILWAY_URL/api/search-songs" -Method Post -Body $body -ContentType "application/json"
    $count = $response.results.Length
    Write-Host "PASS: Search returned $count results" -ForegroundColor Green
    if ($response.message -like "*mock*") {
        Write-Host "WARNING: Using mock data - add YOUTUBE_API_KEY to Railway" -ForegroundColor Yellow
    } else {
        Write-Host "Using real YouTube API" -ForegroundColor Green
    }
} catch {
    Write-Host "FAIL: Search endpoint error" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Deployment Info
Write-Host "Test 4: Deployment Info" -ForegroundColor Yellow
Write-Host "Check Railway logs for:" -ForegroundColor Gray
Write-Host "  - Basic Pitch AI model available" -ForegroundColor Gray
Write-Host "  - Enhanced Chord Detector initialized with Basic Pitch AI" -ForegroundColor Gray
Write-Host "  - tensorflow==2.15.0 installed" -ForegroundColor Gray
Write-Host ""

# Summary
Write-Host $separator -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host $separator -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://chordypi.vercel.app" -ForegroundColor White
Write-Host "2. Click Upload Audio File" -ForegroundColor White
Write-Host "3. Select an MP3/WAV file" -ForegroundColor White
Write-Host "4. Verify: No 415 error - chord analysis works!" -ForegroundColor White
Write-Host ""
Write-Host "Railway Dashboard: https://railway.app" -ForegroundColor Cyan
Write-Host $separator -ForegroundColor Cyan
