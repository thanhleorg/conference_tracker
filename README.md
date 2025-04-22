

# Contributes
- You can contribute to this project by adding conference data to `public/data/conferences.yaml` file.
- There are many examples in the file, so you can use them as a reference.




## To Test 
- First install the dependencies
```bash
# node -v # v23.11.0
# npm -v # 11.3.0

# in the root directory
npm install 
```

- Then run the server to look at the page
```bash
npm run start
```


- Then open the browser and go to `http://localhost:3000/` to see the page.
 


## To Deploy to Github Pages
- Git commit your changes
- Git push your changes to the `main` branch


- Then run the following command to deploy the changes to Github Pages (`gh-pages` branch)
```bash
npm run deploy
```
- You should not have to switch branches manually, the script will do it for you. You should always be on the `main` branch.
