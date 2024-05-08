# Elm-Localegen

Tool to generate elm functions from a json file.

Example:

See the `sample.json` file below

```json
{
  "module": "Translate",
  "locales": {
    "fr": "French",
    "en": "English"
  },
  "typeFunctions": {
    "User": "fullName",
    "My.App.Game": "fullGameName"
  },
  "texts": {
    "login": {
      "fr": "Connexion",
      "en": "Login"
    },
    "grantingUser": {
      "fr": "Bonjour {{user}}",
      "en": "Hello {{user}}"
    },
    "functionWithMultipleVariable": {
      "fr": "Bonjour {{user}}, c'est votre {{count: Int}} visites",
      "en": "Hi {{user}}, it's your {{count: Int}} visit"
    },
    "greetingUserStruct": {
      "fr": "Bonjour {{user: User}}",
      "en": "Hi {{user: User}}"
    },
    "youPlayedGame": {
      "fr": "Vous avez joué à {{game: My.App.Game}}",
      "en": "You played {{game: My.App.Game}}"
    }
  }
}
```

Running `node index.js --input sample.json --output Translate.elm` generates the following file

```elm
module Translate exposing (Locale(..), functionWithMultipleVariable, grantingUser, greetingUserStruct, login, youPlayedGame)

import User
import My.App.Game


type Locale = French | English
  

login : Locale -> String
login language =
    case language of
        English ->
            "Login"

        French ->
            "Connexion"
  

grantingUser : String -> Locale -> String
grantingUser user language =
    case language of
        English ->
            "Hello " ++ user

        French ->
            "Bonjour " ++ user
  

functionWithMultipleVariable : String -> Int -> Locale -> String
functionWithMultipleVariable user count language =
    case language of
        English ->
            "Hi " ++ user ++ ", it's your " ++ count

        French ->
            "Bonjour " ++ user ++ ", c'est votre " ++ count
  

greetingUserStruct : User -> Locale -> String
greetingUserStruct user language =
    case language of
        English ->
            "Hi " ++ User.fullName user

        French ->
            "Bonjour " ++ User.fullName user
  

youPlayedGame : My.App.Game -> Locale -> String
youPlayedGame game language =
    case language of
        English ->
            "You played " ++ My.App.Game.fullGameName game

        French ->
            "Vous avez joué à " ++ My.App.Game.fullGameName game
  
  
```

## The JSON file

- `module` **Required**: Module name of the output file
- `locales` **Required**: Supported locale with their matching type
- `typeFunctions` **Optional**: Mapping of the type with the function used for casting if your string are using custom types. You can omit this if you're planning to use only native functions
- `texts` **Required**: Object for the strings to be translated
