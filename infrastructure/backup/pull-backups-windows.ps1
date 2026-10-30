<#
  Rapatrie la dernière sauvegarde vérifiée du VPS Terra Umbra sur un disque local.
  À lancer sur le PC de l'auteur (Windows 10/11, OpenSSH client intégré).

  Exemple :
    powershell -ExecutionPolicy Bypass -File .\pull-backups-windows.ps1 `
      -Destination "H:\TerraUmbra\sauvegardes" -KeyPath "$env:USERPROFILE\.ssh\terra_umbra"

  Le script :
    1. lit sur le serveur le chemin de la dernière sauvegarde vérifiée ;
    2. la copie si elle n'est pas déjà présente ;
    3. vérifie les empreintes SHA-256 sur le disque local ;
    4. garde les N dernières copies locales (30 par défaut).
  Les sauvegardes contiennent le fichier .env du serveur : le dossier de destination est privé.
#>
param(
  [string]$Destination = "H:\TerraUmbra\sauvegardes",
  [string]$ServerHost = "terra-umbra.fr",
  [string]$User = "debian",
  [string]$KeyPath = "$env:USERPROFILE\.ssh\id_ed25519",
  [int]$Keep = 30
)
$ErrorActionPreference = "Stop"
$sshOpts = @("-i", $KeyPath, "-o", "BatchMode=yes", "-o", "IdentitiesOnly=yes")
$remote = "$User@$ServerHost"

New-Item -ItemType Directory -Force -Path $Destination | Out-Null
$log = Join-Path $Destination "rapatriement.log"
function Write-Log($msg) { $line = "$(Get-Date -Format s)  $msg"; Write-Host $line; Add-Content -Path $log -Value $line }

$latest = (& ssh @sshOpts $remote "cat /opt/terra-umbra/private-backups/latest-verified").Trim()
if (-not $latest -or $latest -notmatch '^/opt/terra-umbra/private-backups/pre-production-\d{8}T\d{6}Z$') {
  throw "Chemin de sauvegarde inattendu : '$latest'"
}
$name = Split-Path $latest -Leaf
$target = Join-Path $Destination $name

if (Test-Path (Join-Path $target "OK")) {
  Write-Log "Déjà présente : $name"
} else {
  if (Test-Path $target) { Remove-Item -Recurse -Force $target }
  Write-Log "Copie de $name"
  & scp @sshOpts -r "${remote}:$latest" $Destination
  if ($LASTEXITCODE -ne 0) { throw "La copie scp a échoué" }

  $sums = Get-Content (Join-Path $target "SHA256SUMS")
  foreach ($line in $sums) {
    $parts = $line -split '\s+', 2
    $expected = $parts[0].ToLower()
    $file = Join-Path $target ($parts[1].TrimStart('*').Trim())
    $actual = (Get-FileHash -Algorithm SHA256 -Path $file).Hash.ToLower()
    if ($actual -ne $expected) { throw "Empreinte incorrecte pour $file" }
  }
  Set-Content -Path (Join-Path $target "OK") -Value "Vérifiée le $(Get-Date -Format s)"
  Write-Log "Copie vérifiée : $name"
}

$copies = Get-ChildItem -Path $Destination -Directory -Filter "pre-production-*" | Sort-Object Name -Descending
if ($copies.Count -gt $Keep) {
  $copies | Select-Object -Skip $Keep | ForEach-Object {
    Remove-Item -Recurse -Force $_.FullName
    Write-Log "Ancienne copie locale supprimée : $($_.Name)"
  }
}
