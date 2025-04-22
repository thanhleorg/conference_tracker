

# Contributes
- You can contribute to this project by checking, adding, and fixing data in **`public/data/conferences.yaml`** file.
  - There are many examples in the file, so you can use them as a reference.
- To contribute, simply clone the repo and make your changes (and test them), commit to your repo, then make a pull request.   



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
 
## Commit your changes
- Test your changes first (see #To Test above).
- Git commit your changes
- Git push your changes to the `main` branch

## To Deploy to Github Pages
> This is mostly for us. You don't need to do this step.

- Then run the following command to deploy the changes to Github Pages (`gh-pages` branch)
```bash
npm run deploy
```
- You should not have to switch branches manually, the script will do it for you. You should always be on the `main` branch.
