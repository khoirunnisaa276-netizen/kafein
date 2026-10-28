$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($PSScriptRoot) + [IO.Path]::DirectorySeparatorChar
$listener = New-Object Net.HttpListener
$listener.Prefixes.Add('http://127.0.0.1:5500/')

try {
  $listener.Start()
  Write-Output 'Kafein running at http://127.0.0.1:5500'

  while ($listener.IsListening) {
    $context = $listener.GetContext()

    try {
      $relativePath = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
      if ([string]::IsNullOrWhiteSpace($relativePath)) {
        $relativePath = 'index.html'
      }

      $filePath = [IO.Path]::GetFullPath([IO.Path]::Combine($root, $relativePath))
      if (-not $filePath.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or
        -not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
        $context.Response.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes('Not Found')
      } else {
        switch ([IO.Path]::GetExtension($filePath).ToLowerInvariant()) {
          '.html' { $context.Response.ContentType = 'text/html; charset=utf-8' }
          '.css' { $context.Response.ContentType = 'text/css; charset=utf-8' }
          '.js' { $context.Response.ContentType = 'application/javascript; charset=utf-8' }
          '.png' { $context.Response.ContentType = 'image/png' }
          default { $context.Response.ContentType = 'application/octet-stream' }
        }
        $bytes = [IO.File]::ReadAllBytes($filePath)
      }

      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } finally {
      $context.Response.Close()
    }
  }
} finally {
  $listener.Close()
}
