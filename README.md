# Elm-Localegen

Tool to generate elm functions from a json file.

Example:

See the `sample.json` file below

```json


```

Running `node index.js --input sample.json --output Translate.elm` generates the following file

```elm
module Translate exposing (functionWithMultipleVariable, grantingUser, greetingUserStruct)

import User exposing (fullName)


grantingUser : String -> String
grantingUser user language =
    case language of
        French ->
            "Bonjour " ++ user

        English ->
            "Hello " ++ user


functionWithMultipleVariable : String -> Int -> String
functionWithMultipleVariable user count language =
    case language of
        French ->
            "Bonjour " ++ user ++ ", c'est votre " ++ count

        English ->
            "Hi " ++ user ++ ", it's your " ++ count


greetingUserStruct : User -> String
greetingUserStruct user language =
    case language of
        French ->
            "Bonjour " ++ fullName user

        English ->
            "Hi " ++ fullName user
```
