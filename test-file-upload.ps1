# Test File Upload to Railway
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "Testing File Upload to Railway Backend" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan

$apiUrl = "https://chordypi-production.up.railway.app/api/analyze-song"

# Create a small test audio file (empty MP3)
$testFile = "test-upload.mp3"
$testContent = [byte[]](0xFF, 0xFB, 0x90, 0x00) # Minimal MP3 header
[System.IO.File]::WriteAllBytes($testFile, $testContent)

Write-Host "`n📁 Created test file: $testFile" -ForegroundColor Green

# Test 1: File Upload
Write-Host "`n🧪 TEST 1: File Upload with 'audio' field" -ForegroundColor Yellow
Write-Host "-" * 80 -ForegroundColor Gray

try {
    $form = @{
        audio = Get-Item -Path $testFile
    }
    
    $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Form $form -ErrorAction Stop
    
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.Value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:" -ForegroundColor Yellow
        Write-Host $responseBody
    }
}

# Cleanup
Remove-Item $testFile -ErrorAction SilentlyContinue

Write-Host "`n" + "=" * 80 -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan
