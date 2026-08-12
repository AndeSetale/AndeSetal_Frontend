import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn
} from '@angular/forms';

export function emailOuTelephoneValide(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

        const valeur = control.value?.trim();

        // Le champ vide est géré par Validators.required
        if (!valeur) {
            return null;
        }

        // Vérification d'une adresse email
        const emailValide =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur);

        // On enlève les espaces et les tirets du numéro
        const telephone = valeur.replace(/[\s-]/g, '');

        // Numéro sénégalais :
        // 77XXXXXXXX, 78XXXXXXXX, 76XXXXXXXX, 75XXXXXXXX, 70XXXXXXXX
        // ou avec le préfixe +221
        const telephoneValide =
            /^(?:\+221)?7[05678]\d{7}$/.test(telephone);

        // Email OU téléphone valide
        if (emailValide || telephoneValide) {
            return null;
        }

        return {
            emailOuTelephoneInvalide: true
        };
    };
}