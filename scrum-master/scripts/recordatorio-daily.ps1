# Recordatorio de la daily: suena y muestra un aviso encima de todas las ventanas.
# Lo lanza una tarea programada de Windows en los días hábiles.
# Con -Datos (carpeta del portafolio) revisa cada proyecto activo y avisa si hoy
# es el último día del sprint o si hoy toca planificación.
param(
  [string]$Datos = '',
  [string]$Hoy = '',      # AAAA-MM-DD, solo para probar
  [switch]$Prueba         # solo para probar: escribe el texto en vez de mostrar el aviso
)

$utf8 = New-Object System.Text.UTF8Encoding($false)
$fechaHoy = if ($Hoy) { [datetime]::ParseExact($Hoy, 'yyyy-MM-dd', $null) } else { (Get-Date).Date }
$dias = @('domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado')

function Siguiente-Habil([datetime]$d) {
  do { $d = $d.AddDays(1) } while ($d.DayOfWeek -eq 'Saturday' -or $d.DayOfWeek -eq 'Sunday')
  return $d
}

function Campo([string]$texto, [string]$nombre) {
  $m = [regex]::Match($texto, "(?mi)^- ${nombre}:[ \t]*(.+)$")
  if ($m.Success) { return $m.Groups[1].Value.Trim() } else { return $null }
}

function Avisos-Proyectos {
  $avisos = @()
  $archivo = Join-Path $Datos 'proyectos.md'
  if (-not $Datos -or -not (Test-Path $archivo)) { return $avisos }
  foreach ($l in [IO.File]::ReadAllLines($archivo, $utf8)) {
    if ($l -notmatch '^\|') { continue }
    $c = $l.Split('|') | ForEach-Object { $_.Trim() }
    if ($c.Count -lt 6 -or $c[1] -eq 'Proyecto' -or $c[1] -match '^-+$' -or $c[1] -eq '') { continue }
    if ($c[5] -notmatch 'activo') { continue }
    $nombre = $c[1]
    $dirSprints = Join-Path $c[3] '.scrum\sprints'
    if (-not (Test-Path $dirSprints)) { continue }
    $activo = $null
    foreach ($f in Get-ChildItem $dirSprints -Filter 'sprint-*.md' | Sort-Object Name) {
      $t = [IO.File]::ReadAllText($f.FullName, $utf8)
      if ((Campo $t 'Estado') -match '^activo$') { $activo = $t; break }
    }
    if (-not $activo) {
      $avisos += "- ${nombre}: no hay sprint activo. HOY ES PLANIFICACIÓN (/planificar)."
      continue
    }
    $finTxt = Campo $activo 'Fin'
    if (-not $finTxt -or $finTxt -notmatch '\d{4}-\d{2}-\d{2}') { continue }
    $fin = [datetime]::ParseExact($Matches[0], 'yyyy-MM-dd', $null)
    if ($fechaHoy -eq $fin) {
      $sig = Siguiente-Habil $fin
      $avisos += "- ${nombre}: HOY TERMINA EL SPRINT. Haz /cerrar-sprint hoy. La planificación es el $($dias[[int]$sig.DayOfWeek]) $($sig.ToString('yyyy-MM-dd'))."
    } elseif ($fechaHoy -gt $fin) {
      $avisos += "- ${nombre}: HOY ES PLANIFICACIÓN. Primero /cerrar-sprint y luego /planificar (historias pendientes y las que faltan por crear)."
    }
  }
  return $avisos
}

$texto = "Hora de tu daily.`n`nAbre Claude en tu proyecto y escribe /daily.`nSon 5 minutos: qué hiciste, qué harás y qué te bloquea."
$avisos = @(Avisos-Proyectos)
if ($avisos.Count -gt 0) { $texto += "`n`nOJO:`n" + ($avisos -join "`n") }

if ($Prueba) { $texto; return }

Add-Type -AssemblyName System.Windows.Forms
1..3 | ForEach-Object { [System.Media.SystemSounds]::Exclamation.Play(); Start-Sleep -Milliseconds 700 }
$dueno = New-Object System.Windows.Forms.Form
$dueno.TopMost = $true
$dueno.ShowInTaskbar = $false
$dueno.WindowState = 'Minimized'
$dueno.Show()
[System.Windows.Forms.MessageBox]::Show($dueno, $texto, 'Scrum Master - Daily', 'OK', 'Information') | Out-Null
$dueno.Close()
