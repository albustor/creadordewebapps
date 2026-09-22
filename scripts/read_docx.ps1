Add-Type -AssemblyName System.IO.Compression.FileSystem

function Read-DocxText($p) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($p)
    $entry = $zip.GetEntry('word/document.xml')
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
    $xml = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    $zip.Dispose()
    return ($xml -replace '<[^>]+>', ' ' -replace '\s+', ' ')
}

$files = Get-ChildItem "D:\AntigravityFinal\HerramientaWebApps\Recursos\octavo\*.docx"
foreach ($f in $files) {
    Write-Output "=== FILE: $($f.Name) ==="
    Read-DocxText $f.FullName
}
