@echo off
cd C:\Temp\TAE\Projects\teatae\teatae.github.io  
git pull  
git add --all  
git commit -m "moved fonts to css"  
git push -u origin main  

cmd /k