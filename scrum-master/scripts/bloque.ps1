# Cronómetro de bloques de concentración (por defecto 30 minutos).
# Abre una ventanita: eliges proyecto y en qué vas a trabajar, cuenta el tiempo,
# suena al terminar y agrega una fila en <Datos>\bloques.md.
# Si te interrumpen, botón "Me interrumpieron": se guarda como bloque cortado.
param(
  [Parameter(Mandatory = $true)][string]$Datos,
  [double]$Minutos = 30,
  [switch]$Prueba   # solo para probar: empieza solo y no muestra el aviso final
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()

$archivoBloques = Join-Path $Datos 'bloques.md'
$archivoProyectos = Join-Path $Datos 'proyectos.md'
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Leer-Proyectos {
  $lista = @()
  if (Test-Path $archivoProyectos) {
    foreach ($l in [IO.File]::ReadAllLines($archivoProyectos, $utf8)) {
      if ($l -notmatch '^\|') { continue }
      $c = $l.Split('|') | ForEach-Object { $_.Trim() }
      if ($c.Count -lt 6) { continue }
      if ($c[1] -eq 'Proyecto' -or $c[1] -match '^-+$' -or $c[1] -eq '') { continue }
      if ($c[5] -match 'terminado') { continue }
      $lista += $c[1]
    }
  }
  if ($lista.Count -eq 0) { $lista += 'General' }
  return $lista
}

function Guardar-Bloque($inicio, $fin, $proyecto, $enQue, $resultado) {
  if (-not (Test-Path $archivoBloques)) {
    $enc = "# Bloques de trabajo`n| Fecha | Inicio | Fin | Minutos | Proyecto | En qué | Resultado |`n|---|---|---|---|---|---|---|`n"
    [IO.File]::WriteAllText($archivoBloques, $enc, $utf8)
  }
  $min = [math]::Round(($fin - $inicio).TotalMinutes)
  $limpio = { param($t) ($t -replace '\|', '/' -replace '[\r\n]+', ' ').Trim() }
  $q = & $limpio $enQue
  if ($q -eq '') { $q = '-' }
  $fila = '| {0} | {1} | {2} | {3} | {4} | {5} | {6} |' -f `
    $inicio.ToString('yyyy-MM-dd'), $inicio.ToString('HH:mm'), $fin.ToString('HH:mm'), $min, (& $limpio $proyecto), $q, $resultado
  $actual = [IO.File]::ReadAllText($archivoBloques, $utf8)
  if ($actual.Length -gt 0 -and -not $actual.EndsWith("`n")) { $fila = "`n" + $fila }
  [IO.File]::AppendAllText($archivoBloques, $fila + "`n", $utf8)
}

# --- Ventana ---
$form = New-Object System.Windows.Forms.Form
$form.Text = 'Bloque de concentración'
$form.Size = New-Object System.Drawing.Size(380, 300)
$form.StartPosition = 'CenterScreen'
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
$form.TopMost = $true
$fuente = New-Object System.Drawing.Font('Segoe UI', 10)
$form.Font = $fuente

$lblProy = New-Object System.Windows.Forms.Label
$lblProy.Text = 'Proyecto:'; $lblProy.Location = '15,15'; $lblProy.AutoSize = $true
$cmbProy = New-Object System.Windows.Forms.ComboBox
$cmbProy.Location = '15,38'; $cmbProy.Width = 335; $cmbProy.DropDownStyle = 'DropDown'
Leer-Proyectos | ForEach-Object { [void]$cmbProy.Items.Add($_) }
$cmbProy.SelectedIndex = 0

$lblQue = New-Object System.Windows.Forms.Label
$lblQue.Text = '¿En qué vas a trabajar? (ej. PRY-004)'; $lblQue.Location = '15,72'; $lblQue.AutoSize = $true
$txtQue = New-Object System.Windows.Forms.TextBox
$txtQue.Location = '15,95'; $txtQue.Width = 335

$lblReloj = New-Object System.Windows.Forms.Label
$lblReloj.Font = New-Object System.Drawing.Font('Segoe UI', 28, [System.Drawing.FontStyle]::Bold)
$lblReloj.Location = '15,128'; $lblReloj.Size = '335,50'; $lblReloj.TextAlign = 'MiddleCenter'
$lblReloj.Text = ('{0:00}:00' -f [math]::Floor($Minutos))

$lblAviso = New-Object System.Windows.Forms.Label
$lblAviso.Location = '15,180'; $lblAviso.Size = '335,22'; $lblAviso.TextAlign = 'MiddleCenter'
$lblAviso.Text = 'Deja el celular lejos. Solo esto por ahora.'

$btn = New-Object System.Windows.Forms.Button
$btn.Text = 'Empezar bloque'; $btn.Location = '15,210'; $btn.Size = '335,38'

$form.Controls.AddRange(@($lblProy, $cmbProy, $lblQue, $txtQue, $lblReloj, $lblAviso, $btn))

$script:inicio = $null
$script:fin = $null
$script:guardado = $false
$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 1000

function Terminar($resultado) {
  if ($script:guardado -or -not $script:inicio) { return }
  $timer.Stop()
  $script:guardado = $true
  $ahora = Get-Date
  $min = ($ahora - $script:inicio).TotalMinutes
  if ($resultado -eq 'cortado' -and $min -lt 1) { return }  # menos de 1 minuto: no se anota
  Guardar-Bloque $script:inicio $ahora $cmbProy.Text $txtQue.Text $resultado
}

$timer.Add_Tick({
  $resta = $script:fin - (Get-Date)
  if ($resta.TotalSeconds -le 0) {
    $lblReloj.Text = '00:00'
    Terminar 'completo'
    if (-not $Prueba) {
      1..3 | ForEach-Object { [System.Media.SystemSounds]::Exclamation.Play(); Start-Sleep -Milliseconds 700 }
      $form.Activate()
      [System.Windows.Forms.MessageBox]::Show($form,
        "¡Bloque terminado! Quedó anotado.`n`nDescansa lo que necesites. Cuando vuelvas, abre otro bloque.",
        'Bloque terminado', 'OK', 'Information') | Out-Null
    }
    $form.Close()
    return
  }
  $lblReloj.Text = '{0:00}:{1:00}' -f [math]::Floor($resta.TotalMinutes), $resta.Seconds
})

$btn.Add_Click({
  if (-not $script:inicio) {
    $script:inicio = Get-Date
    $script:fin = $script:inicio.AddSeconds($Minutos * 60)
    $cmbProy.Enabled = $false; $txtQue.Enabled = $false
    $btn.Text = 'Me interrumpieron (cortar bloque)'
    $timer.Start()
  } else {
    Terminar 'cortado'
    $form.Close()
  }
})

# Cerrar con la X a mitad de bloque cuenta como cortado.
$form.Add_FormClosing({ if ($script:inicio -and -not $script:guardado) { Terminar 'cortado' } })

if ($Prueba) { $form.Add_Shown({ $btn.PerformClick() }) }
[void]$form.ShowDialog()
