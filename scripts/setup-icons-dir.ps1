// scripts/setup-icons-dir.ps1

# Create icons directory structure
New-Item -Path "./public/images/icons" -ItemType Directory -Force
New-Item -Path "./public/images/avatar" -ItemType Directory -Force
New-Item -Path "./public/images/refer" -ItemType Directory -Force
New-Item -Path "./public/images/cards" -ItemType Directory -Force

Write-Host "? Created directory structure for app icons and images"

# Create placeholder logo icon (just a simple red square with white text)
$logoSvgContent = @"
<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" fill="#7b2528"/>
  <text x="96" y="104" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">MEMBERS 1ST</text>
</svg>
"@

Set-Content -Path "./public/images/icons/logo.svg" -Value $logoSvgContent -Force

# Convert SVG to PNG using PowerShell (requires Inkscape for proper conversion)
# This is a fallback that will create a blank PNG file if Inkscape is not available
$blankPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDI0OTcxMTMzOTlFMTFFQUI1MTBBNzZCQ0VCQkQ5NjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDI0OTcxMTQzOTlFMTFFQUI1MTBBNzZCQ0VCQkQ5NjgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMjQ5NzExMTM5OUUxMUVBQjUxMEE3NkJDRUJCRDk2OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMjQ5NzExMjM5OUUxMUVBQjUxMEE3NkJDRUJCRDk2OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiiK5zwAAAMAUExURcwAAP///7NTU2YAAJkAAOeYmNlCQpwJCe6qqu+xseienvHAwOzv8Jqep9w2NvPz9QQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEI3TlMcAAACAdFJOU/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AOAVLZwAABKFJREFUeNrt3Wl3EzEMBeCMXZ/PW+lp2frjqwQos4QZmQfjyTD3/RGKHd+BQsE2UtRqtVqtVqvVarVarVar1Wq1Wq1Wq9VqtVqtVqvVarVarVar1Wq1Wq1W61FJNgSZ/7K73frv4aEDQB0B1hGgKj+tn1aAAvzrAHmJ7Pv0/eoFkBcYC8BLYI8gHCAvMTaAvEjfQxDe6aNa1kqzrNAmPIYgAFoEGQDaCHkB0BJgBbASYAZgEnoHyCmIDsB4i5AA3CfJKcgNQHqUkBTkB+C8TGpBCQCGAtdKRO5BARylQLvSAHQJnQdFAHQNDQeqJCDbUGLlANT5aSNUAJCBqPKTNagBIKsQ5X++QRUAWYSKnywW1AGQ2c9rkKoA+FYMCCoDwKcQJQGcD3JJAPmI3QJymX4Ach6zBdEAZLKYLQgHIKtxhgA+CgwAbLGGAA4iB4BZYlcQD8C2I7yFBACzxCwbSgJYb0VaQRgAG25pLUgEQGe7JA/qAOh2mYNAhwDbvVoQCLDdrSq/CIANdpUCMQDb7coEcnMNAViUe1B3ngJMFgCYF3tP+/0dYLQAkEXpz/Sef2T5RQBs2mP0oQqA1xAdgBa4h6gAtIh8CsUBaKHODtEBeImL70NUAFqGfgpcfW8CsNEEWwNIp5tYDMDLHMJwAV7o6MfUUOj4BxGAl/p+xV2I+VXGOMc/gAC83P5kFQDgBc8WgwBe8mzUAF72ZM4qwAtvTJkGvjgOgBav7AiADT7whgBs8sE3A4A3/oEGgLf+YQdgs4++FQDb/PBrANjmx68AkPJPPE6aFEB2/MJBICUA24oXEAjAeGDxBiEA/gLhjX7RCIDPOX8D2H4QiJOXwPTwzgxAXn51AbjLINkJwP1z0C0I2gHCBKHNINAAkIpE+gxhvQ9oAaiKdPoEYVgHtABYRUK9hbDcAawAWEVSfYSw2wG0AFxFYr2HMNsBvABcRXK9g7DaAbwAXMUDevMbYvUfLxeCyAXg/3zOz7E+QHjzd8gBVIJEeqqfLgrxEKRjgIiA1tgQpEuAQIjbQ5CuAd7eQ3JBeGS+KohxuDGEz0C4Iqi3EPkI1FMItpK+CVItSH8hzA6kBiHCdYyNQQQEsYKQIEDfR3wGYkCC6Pf1HoLAzMwCbggSPYYNBwb1FiJX1c3gFtYQxLsGA4GhTBD1KlZkJtSTePBLsREQ78GEJDDUCbJeyXMDGCu3Q4hnRmAQmOoFua9lZw0QzznxXcydYExj8Y3EXiS+G4ltMfiOJnY1k34ttysotk+wnVM2oCUQPwvYgPpCkP88YQOy3YPkfZEPWPdhObblgwEk0JsUvYmMQJkgtK+SrU8lhMDeJto+ZQZqCyJvraVMw8JA5MO1lGm4B8geBzgr8o2Xz2yVuRR8UWPHAJTXozHN94AyJKvA0J5i09ypIc73gCLEYsCcn5XfG78HlCFZBP78rLwBeIHQW5D5PSAOyfv0s/IeeYNvAXGI1wD784I3+BZwh4wv1lK9AsDCkOWQ7DsEXwLQkM6QOj+zIYMhAA7pDMnzMxrSFwLggO4Qrw/5Af/OtB3GrNgKAAAAAElFTkSuQmCC"
$logoBytes = [Convert]::FromBase64String($blankPngBase64)
[IO.File]::WriteAllBytes("./public/images/icons/logo.png", $logoBytes)

Write-Host "? Created basic placeholder logo"

# Create placeholder avatar image
$avatarSvgContent = @"
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#333"/>
  <circle cx="50" cy="40" r="15" fill="#888"/>
  <path d="M25,85 C25,65 75,65 75,85" fill="#888"/>
</svg>
"@

Set-Content -Path "./public/images/avatar/jess-coleman.svg" -Value $avatarSvgContent -Force

# Create a simple PNG placeholder
[IO.File]::WriteAllBytes("./public/images/avatar/jess-coleman.png", $logoBytes)
[IO.File]::WriteAllBytes("./public/images/avatar/robert-thompson.png", $logoBytes)
[IO.File]::WriteAllBytes("./public/images/refer/refer-friend.png", $logoBytes)

Write-Host "? Created placeholder avatar and reference images"
