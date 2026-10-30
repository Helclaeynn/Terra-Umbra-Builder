# Sauvegardes : quotidien sur le VPS, copie sur le PC de l'auteur

## 1. Côté serveur (installé le 30/10/2026)

`daily-backup.sh` appelle `infrastructure/production/backup.sh` (dump PostgreSQL, archive des médias de l'éditeur, restauration témoin, empreintes), puis supprime les sauvegardes de plus de 14 jours en en gardant au moins 7. La dernière sauvegarde vérifiée n'est jamais supprimée.

Le VPS n'a pas `cron` : la sauvegarde tourne avec un minuteur systemd, tous les jours à 4 h 17 (heure de Paris), rattrapée au démarrage si elle a été manquée.

- Script : `/opt/terra-umbra/infrastructure/backup/daily-backup.sh`
- Minuteur : `/etc/systemd/system/terra-umbra-backup.{service,timer}` (copies dans ce dossier)
- Journal : `/opt/terra-umbra/private-backups/daily.log`
- Vérifier : `systemctl list-timers terra-umbra-backup.timer` ; lancer à la main : `sudo systemctl start terra-umbra-backup.service`

Les 49 sauvegardes antérieures au 30/10 ont été copiées (empreintes vérifiées) dans `H:\TerraUmbra\sauvegardes\anciennes` avant la première purge.

## 2. Côté PC (Windows, disque H)

`pull-backups-windows.ps1` récupère la dernière sauvegarde vérifiée par SSH, la copie dans `H:\TerraUmbra\sauvegardes`, vérifie ses empreintes et garde les 30 dernières copies.

1. Une clé SSH dédiée sur le PC : `ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\terra_umbra`, puis ajouter la clé publique à `~/.ssh/authorized_keys` de l'utilisateur `debian` sur le VPS.
2. Premier essai à la main, dans PowerShell (la première connexion demande d'accepter l'empreinte du serveur ; ensuite le script tourne sans question) :
   `powershell -ExecutionPolicy Bypass -File .\pull-backups-windows.ps1 -KeyPath "$env:USERPROFILE\.ssh\terra_umbra"`
3. Planification : Planificateur de tâches → Créer une tâche → déclencheur quotidien (par exemple 9 h, après la sauvegarde de 4 h 17) → action `powershell.exe` avec les arguments `-ExecutionPolicy Bypass -File "chemin\pull-backups-windows.ps1" -KeyPath "C:\Users\…\.ssh\terra_umbra"`. Cocher « Exécuter même si l'utilisateur n'est pas connecté » si le PC reste allumé, sinon la tâche rattrape au prochain démarrage (« Exécuter la tâche dès que possible après un démarrage planifié manqué »).

Les sauvegardes contiennent le `.env` du serveur (mots de passe) : le dossier sur H doit rester privé, hors de tout dossier synchronisé ou partagé.

## 3. Tester une restauration (une fois par mois)

Sur le VPS ou en recette : `pg_restore --no-owner -d <base_de_test> database.dump`, puis ouvrir quelques fiches et campagnes. `backup.sh` fait déjà une restauration témoin à chaque sauvegarde ; le test mensuel vérifie en plus que la copie sur H est complète.
