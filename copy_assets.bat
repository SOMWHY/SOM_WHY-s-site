@echo off

REM 创建目录结构
mkdir "public\assets" 2>nul
mkdir "public\assets\audio" 2>nul

REM 复制音频文件
echo 复制音频文件...
xcopy "src\assets\audio\*.mp3" "public\assets\audio\" /Y

REM 复制图片文件
echo 复制图片文件...
xcopy "src\assets\*.webp" "public\assets\" /Y

REM 复制其他可能的资源文件
xcopy "src\assets\*.png" "public\assets\" /Y 2>nul
xcopy "src\assets\*.jpg" "public\assets\" /Y 2>nul
xcopy "src\assets\*.jpeg" "public\assets\" /Y 2>nul

REM 验证操作
echo 验证资源文件...
dir "public\assets"
dir "public\assets\audio"

echo 资源文件复制完成！
echo 现在可以运行 npm run build 构建项目，然后部署到 Netlify。
pause