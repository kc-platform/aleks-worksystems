Add-Type -AssemblyName System.Drawing
$source = Join-Path (Split-Path $PSScriptRoot -Parent) 'src\assets'
$headlines = @{
  en = @('Make everyday', 'work simpler.', 'WORK SYSTEMS LAB / THE CLARITY SWITCH', 'AS IT IS  >  AS IT COULD BE', 'OWNER  /  STATUS  /  NEXT STEP')
  es = @('Haz más simple', 'el trabajo diario.', 'LABORATORIO DE SISTEMAS / CLARIDAD', 'COMO ESTÁ  >  COMO PODRÍA SER', 'RESPONSABLE  /  ESTADO  /  SIGUIENTE PASO')
  ru = @('Повседневная работа', 'может быть проще.', 'ЛАБОРАТОРИЯ СИСТЕМ / ЯСНОСТЬ', 'КАК СЕЙЧАС  >  КАК МОЖЕТ БЫТЬ', 'ОТВЕТСТВЕННЫЙ  /  СТАТУС  /  ДАЛЬШЕ')
}
$paper=[System.Drawing.Color]::FromArgb(245,243,236)
$ink=[System.Drawing.Color]::FromArgb(34,38,35)
$order=[System.Drawing.Color]::FromArgb(49,85,72)
$friction=[System.Drawing.Color]::FromArgb(164,82,49)
$clarity=[System.Drawing.Color]::FromArgb(220,229,219)
foreach($language in @('en','es','ru')){
  $bmp=[System.Drawing.Bitmap]::new(1200,630)
  $g=[System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAlias
  $g.Clear($paper)
  $g.FillRectangle([System.Drawing.SolidBrush]::new($order),0,0,1200,12)
  $brand=[System.Drawing.Font]::new('Arial',23,[System.Drawing.FontStyle]::Bold)
  $headingSize=if($language -eq 'ru'){56}elseif($language -eq 'es'){66}else{72}
  $heading=[System.Drawing.Font]::new('Arial',$headingSize,[System.Drawing.FontStyle]::Bold)
  $detail=[System.Drawing.Font]::new('Arial',18,[System.Drawing.FontStyle]::Bold)
  $small=[System.Drawing.Font]::new('Arial',12,[System.Drawing.FontStyle]::Bold)
  $g.DrawString('ALEKS WORK SYSTEMS',$brand,[System.Drawing.SolidBrush]::new($order),72,63)
  $g.DrawString($headlines[$language][0],$heading,[System.Drawing.SolidBrush]::new($ink),68,185)
  $g.DrawString($headlines[$language][1],$heading,[System.Drawing.SolidBrush]::new($order),68,274)
  $g.DrawString($headlines[$language][2],$detail,[System.Drawing.SolidBrush]::new($ink),72,525)
  $g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::White),770,145,350,350)
  $g.DrawRectangle([System.Drawing.Pen]::new($ink,2),770,145,350,350)
  $g.FillRectangle([System.Drawing.SolidBrush]::new($ink),770,145,350,45)
  $g.DrawString($headlines[$language][3],$small,[System.Drawing.Brushes]::White,783,158)
  foreach($y in @(226,307)){$g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(248,238,232)),792,$y,127,55);$g.DrawRectangle([System.Drawing.Pen]::new($friction,2),792,$y,127,55);$g.FillRectangle([System.Drawing.SolidBrush]::new($clarity),990,$y,106,55);$g.DrawRectangle([System.Drawing.Pen]::new($order,2),990,$y,106,55)}
  $g.DrawString('→',[System.Drawing.Font]::new('Arial',34),[System.Drawing.SolidBrush]::new($order),936,267)
  $g.DrawString($headlines[$language][4],$small,[System.Drawing.SolidBrush]::new($order),784,443)
  $bmp.Save((Join-Path $source "og-$language.png"),[System.Drawing.Imaging.ImageFormat]::Png)
  $brand.Dispose();$heading.Dispose();$detail.Dispose();$small.Dispose();$g.Dispose();$bmp.Dispose()
}
