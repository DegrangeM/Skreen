# Skreen

Skreen est une application qui permet à un enseignant de voir les écrans de ses élèves.

Skreen est une application web qui ne nécessite donc aucune installation que ce soit sur l'ordinateur de l'enseignant ou des élèves.

L'application a cependant besoin d'être hébergé sur une internet afin que l'enseignant et les élèves puissent y accéder via leur navigateur internet.

L'enseignant ne peut accéder aux écrans de ses élèves que lorsque ces derniers ont la page web de Skreen ouverte et peuvent donc cesser à tout moment la diffusion.

L'enseignant ne peut donc pas accéder aux écrans de ses élèves à leur insu.

![image](https://user-images.githubusercontent.com/53106394/87574631-effb2e00-c6ce-11ea-8263-2402b548a964.png)


## Hébergement de l'application sur internet

L'application est codé en NodeJs est néecessite donc d'être hebergée sur un serveur. Il est possible d'héberger gratuitement et facilement l'application en suivant ces étapes :

- Cliquer sur ce bouton : [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/DegrangeM/Skreen)

- Créer son compte et valider son adresse email

- Une fois arrivé sur l'écran ci-dessous :
  
  <img src="https://user-images.githubusercontent.com/53106394/87570968-a8be6e80-c6c9-11ea-915d-94f68ea553cb.png" height="250" />

   - Saisir le nom de votre choix pour l'application (minuscules, chiffres et tiret uniquement) : attention ce nom aura une influence sur l'adresse URL de l'application
   
   - Sélectionner "Europe" comme région
   
   - Cliquer sur Deploy App et attendre que le déploiement se finisse
   
- Lorsque le message "Your app was successfully deployed" apparait, cliquer sur le bouton Manage Apps.

   - Cliquer ensuite sur "Settings" puis sur le bouton "Reveal Convig Vars"
   
   - Copier coller la suite de lettre et de nombre bizarre à droite de TEACHER_PASSWORD (vous pouvez aussi le modifier si vous le souhaitez)
   
   - Plus bas, vous devriez trouver le message "Your app can be found at" suivit d'un lien. Cliquer sur ce lien.
   
   - Vous devriez avoir le message suivant d'affiché : `Cannot GET /` si ce n'est pas le cas patienter une minute puis actualiser la page. Si ça ne fonctionne pas revenez sur la page précédente, appuyez sur le bouton tout en bas "Delete Apps" et recommencez la procédure du début.
   
   - Rajouter à la fin de l'adresse url `/teacher.html#XXXXX`en remplaçant XXXXX par le mot de passe enseignant copié précédemment.
     Par exemple, si l'adresse de votre application est `https://skreen.herokuapp.com/` et que votre TEACHER_PASSWORD est `797c59a0a173b2d28d2417801c252002fa8a59758944fdb9fc5321e5eda03288` il faut se rendre à l'adresse `https://skreen.herokuapp.com/teacher.html#797c59a0a173b2d28d2417801c252002fa8a59758944fdb9fc5321e5eda03288`.
     
- Vous avez désormais accès à l'interface professeur ! Sauvegardez cette adresse url dans votre marque page et ne donnez ce lien à personne !

Remarque : votre application pourra être utilisé gratuitement 550 heures par mois. L'application s'éteignant automatiquement au bout de 30 minutes de non utilisation. Même avec une utilisation quotidienne vous ne dépasserez donc jamais ce quotat.

## Utilisation

- Rendez-vous sur l'interface professeur (si l'interface prof ne s'affiche pas, patientez 1 minute puis réactualisez : l'application est en veille est à besoin d'un peu de temps pour se relancer)

- Cliquez sur le bouton Créer lien, saisissez le nom de l'élève par exemple `Pierre Dupont (3B)` puis validez. Un lien s'affiche : demandez alors à l'élève en question d'accéder à ce lien (en lui envoyant le lien par email par exemple). Faites de même pour chacun de vos élèves. Il est conseillé de demandé aux élèves d'enregistrer le lien dans leur marque-page pour pouvoir y accéder plus rapidement.

- L'élève arrive alors sur une page où on lui demande de cliquer pour partager son écran. Après un clic, le navigateur internet lui demande ce qu'il souhaite partager.

    - Sous Chrome :

      L'écran de l'ordinateur s'affiche alors en petit. Il suffit de cliquer dessus puis de cliquer sur le bouton "Partager".
      
    - Sous Firefox :
    
      Dans la liste déroulante, choisir "Écran entier" tout en bas puis cliquer sur autoriser.
      
- Le fond de la page web devient alors vert et l'élève voit son propre écran. Cela signifie que tout est bon et vous devriez maintenant voir son écran sur l'interface professeur.

## Remarques

- Vous pouvez maintenir le clic gauche enfoncé sur l'image de l'écran d'un élève afin d'en voir une version légèrement plus grande.

- Si vous avez mis un espace ou des caractères spéciaux dans le nom de l'élève, il est possible que le lien ne soit pas correctement détecté par le logiciel de messagerie. Faites le lien manuellement via le bouton de mise en forme ou ne mettez pas d'espèces / caractères spéciaux dans le nom des élèves.

- Vous pouvez héberger manuellement l'application en dehors de Heroku si vous en avez les compétences. Votre serveur devra avoir nodejs d'installé et l'application pourra être lancée par la commande `node index.js`. Pensez à téléchager les modules avec `npm install` et à changer les valeurs par défaut de `SALT`et `TEACHER_PASSWORD` dans le fichier `index.js`. Pensez à changer le port (3000 par défaut) si besoin.
