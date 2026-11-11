# Baixa legalmente as 78 imagens históricas do Rider-Waite-Smith (ilustração original, 1909).
# Não exige Node, Python, servidor ou dependências. Executar no Windows com internet.
$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'
$folder = Join-Path $PSScriptRoot 'assets\cards'
New-Item -ItemType Directory -Path $folder -Force | Out-Null
$ids = @()
for ($i=0; $i -le 21; $i++) { $ids += ('ar{0:D2}' -f $i) }
foreach ($prefix in @('wa','cu','sw','pe')) {
  for ($i=1; $i -le 14; $i++) { $ids += ('{0}{1:D2}' -f $prefix,$i) }
}
$success=0; $failed= @()
Write-Host 'ARCANA ATLAS - Download das 78 cartas Rider-Waite-Smith' -ForegroundColor Cyan
Write-Host 'Fonte: https://github.com/sixseeds/tarot-api (artes originais de 1909)'
foreach($id in $ids) {
  $dest = Join-Path $folder ($id+'.jpg')
  if((Test-Path $dest) -and ((Get-Item $dest).Length -gt 3000)) { $success++; continue }
  $urls = @(
    "https://petaloverflow.github.io/tarot-api/cards/$id.jpg",
    "https://raw.githubusercontent.com/sixseeds/tarot-api/main/cards/$id.jpg"
  )
  $downloaded=$false
  foreach($url in $urls){
    try {
      Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing -TimeoutSec 25 -ErrorAction Stop
      if((Get-Item $dest).Length -lt 3000) { throw 'Imagem pequena ou invalida.' }
      $downloaded=$true; break
    }catch{ Remove-Item $dest -ErrorAction SilentlyContinue }
  }
  if($downloaded){ $success++; Write-Host ("[{0}/78] {1}: OK" -f $success,$id) -ForegroundColor DarkGreen }
  else {$failed += $id; Write-Host ("ERRO: $id") -ForegroundColor Red }
}
Write-Host "`nCartas disponiveis: $success/78" -ForegroundColor Yellow
if($failed.Count -gt 0) { Write-Host ('Falhas: ' + ($failed -join ', ')); Write-Host 'Execute novamente para tentar somente as faltantes.' }
else {Write-Host 'Pronto: agora as imagens funcionam offline.' -ForegroundColor Green}
Write-Host 'Abra index.html no navegador. Pressione ENTER para sair.'
Read-Host | Out-Null
