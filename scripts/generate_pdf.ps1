$htmlPath = "D:\AntigravityFinal\HerramientaWebApps\Recursos\octavo\Informe_Analisis_y_Plan_Diagnostico_8vo_MEP.html"
$pdfPath = "D:\AntigravityFinal\HerramientaWebApps\Recursos\octavo\Informe_Analisis_y_Plan_Diagnostico_8vo_MEP.pdf"

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
}

Write-Output "Usando navegador: $edgePath"
Write-Output "Origen: $htmlPath"
Write-Output "Destino: $pdfPath"

$arguments = @(
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--print-to-pdf=`"$pdfPath`"",
    "`"$htmlPath`""
)

$process = Start-Process -FilePath $edgePath -ArgumentList $arguments -Wait -PassThru

if (Test-Path $pdfPath) {
    $fileInfo = Get-Item $pdfPath
    Write-Output "PDF GENERADO EXITOSAMENTE:"
    Write-Output "Ruta: $($fileInfo.FullName)"
    Write-Output "Tamano: $($fileInfo.Length) bytes"
} else {
    Write-Output "ERROR: No se pudo generar el archivo PDF."
}
