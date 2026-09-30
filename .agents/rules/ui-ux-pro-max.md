# Règle UI/UX Pro Max : Vérification Systématique des Interfaces

À chaque demande de création, modification ou refonte d'interface (page, composant, modal, formulaire, dashboard) :

1. **Vérification Immédiate du Skill `ui-ux-pro-max`** :
   - Vérifier la hiérarchie visuelle, l'espacement sur base 8px, et le contraste des couleurs (WCAG AA).
   - Bannir les designs génériques ou plats : ajouter de la profondeur (ombres douces, bordures subtiles, glassmorphism, micro-gradients).
   - Assurer les 4 états interactifs pour chaque élément (`default`, `hover`, `active/pressed`, `disabled`).
   - Intégrer des micro-interactions de haute qualité (transitions fluides, scale subtil, feedback visuel au clic).

2. **Mobile First & Responsive sans scroll horizontal** :
   - Tester l'adaptation sur mobile, tablette et desktop.
   - S'assurer que les zones tactiles font au moins 44x44px.

3. **Formulaires & Feedback Utilisateur** :
   - Labels visibles, erreurs inline sous les champs concernés, états de chargement explicites.
   - Aucun placeholder comme unique label.
