param(
  [string]$Message = 'Update Theseus Codex progress preview',
  [string]$VerifiedReport
)
$ErrorActionPreference = 'Stop'
$taskRepo = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..')).Path
$previewRepo = (Resolve-Path -LiteralPath (Join-Path $taskRepo '..\pages-preview')).Path
if ((git -C $previewRepo remote get-url origin) -ne 'https://github.com/brockliddicoat/theseus-codex-preview.git') { throw 'Wrong preview remote' }
if ($VerifiedReport) {
  $report = Get-Content -LiteralPath $VerifiedReport -Raw | ConvertFrom-Json
  if ($report.issueFrames -ne 0 -or $report.errors.Count -ne 0) { throw 'The supplied render report has failures; preview unchanged' }
  $candidate = (Resolve-Path -LiteralPath $report.testedHtml).Path
  if ((Get-FileHash -LiteralPath $candidate -Algorithm SHA256).Hash.ToLowerInvariant() -ne $report.htmlSha256) { throw 'Tested artifact changed; preview unchanged' }
} else {
  python -X utf8 (Join-Path $PSScriptRoot 'build_revamp.py')
  if ($LASTEXITCODE -ne 0) { throw 'Build failed; preview unchanged' }
  $candidate = Join-Path $taskRepo 'deck\dist\index.html'
}
Copy-Item -LiteralPath $candidate -Destination (Join-Path $previewRepo 'index.html') -Force
$publishedHtml = Get-Content -LiteralPath (Join-Path $previewRepo 'index.html') -Raw
$buildMatch = [regex]::Match($publishedHtml, 'const RV_BUILD=(\{[^;\r\n]+\});')
if (-not $buildMatch.Success) { throw 'Preview lacks a content build identity' }
$version = $buildMatch.Groups[1].Value | ConvertFrom-Json
$publishedMeta = @{ buildId = $version.id; at = $version.at; scenes = 0 }
$publishedMeta.scenes = [regex]::Matches($publishedHtml, 'RV\.add\(').Count
[IO.File]::WriteAllText((Join-Path $previewRepo 'preview-version.json'), ($publishedMeta | ConvertTo-Json -Compress))
$builtAssets = Join-Path $taskRepo 'deck\dist\assets'
if (Test-Path -LiteralPath $builtAssets) { Copy-Item -LiteralPath $builtAssets -Destination $previewRepo -Recurse -Force }
git -C $previewRepo add -- index.html assets preview-version.json
git -C $previewRepo diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Output 'Preview source is already current; verifying/refreshing the Pages build.'
} else {
  git -C $previewRepo commit -m $Message
  if ($LASTEXITCODE -ne 0) { throw 'Preview commit failed' }
  git -C $previewRepo -c http.version=HTTP/1.1 push origin main
  if ($LASTEXITCODE -ne 0) { throw 'Preview push failed; inspect remote before retrying' }
}
gh api --method POST repos/brockliddicoat/theseus-codex-preview/pages/builds --jq '{status,url}'
if ($LASTEXITCODE -ne 0) { throw 'Source pushed, but the Pages build request failed. Do not report it live.' }
Write-Output 'Pushed preview and requested Pages build. Verify the matching commit and live HTTP response before reporting it published.'
