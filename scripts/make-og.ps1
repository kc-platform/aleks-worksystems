Add-Type -AssemblyName System.Drawing
$source = Join-Path (Split-Path $PSScriptRoot -Parent) 'src\assets'
$headlines = @{
    en = @('Less chaos.', 'More control.', 'Practical systems for everyday work')
    es = @('Menos caos.', 'Más control.', 'Sistemas prácticos para el trabajo diario')
    ru = @('Меньше хаоса.', 'Больше контроля.', 'Практичные системы для повседневной работы')
}
foreach ($language in @('en', 'es', 'ru')) {
    $bitmap = [System.Drawing.Bitmap]::new(1200, 630)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(247, 248, 244))
    $accentBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(183, 204, 147))
    $greenBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(18, 63, 55))
    $secondBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(56, 117, 99))
    $mutedBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(77, 93, 85))
    $labelFont = [System.Drawing.Font]::new('Arial', 25, [System.Drawing.FontStyle]::Bold)
    $headingFont = [System.Drawing.Font]::new('Georgia', 91, [System.Drawing.FontStyle]::Regular)
    $italicSize = if ($language -eq 'ru') { 76 } else { 91 }
    $italicFont = [System.Drawing.Font]::new('Georgia', $italicSize, [System.Drawing.FontStyle]::Italic)
    $subFont = [System.Drawing.Font]::new('Arial', 24, [System.Drawing.FontStyle]::Regular)
    $graphics.FillRectangle($accentBrush, 0, 0, 18, 630)
    $graphics.DrawString('ALEKS WORK SYSTEMS', $labelFont, $greenBrush, 84, 65)
    $graphics.DrawString($headlines[$language][0], $headingFont, $greenBrush, 78, 195)
    $graphics.DrawString($headlines[$language][1], $italicFont, $secondBrush, 78, 315)
    $graphics.DrawString($headlines[$language][2], $subFont, $mutedBrush, 84, 525)
    $bitmap.Save((Join-Path $source "og-$language.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $subFont.Dispose(); $italicFont.Dispose(); $headingFont.Dispose(); $labelFont.Dispose()
    $mutedBrush.Dispose(); $secondBrush.Dispose(); $greenBrush.Dispose(); $accentBrush.Dispose()
    $graphics.Dispose(); $bitmap.Dispose()
}
