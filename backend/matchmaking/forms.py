from django import forms

class LocalTournamentForm(forms.Form):
    tournament_name = forms.CharField(max_length=100, required=True)
    players = forms.CharField(widget=forms.Textarea, required=True)

    def clean_players(self):
        players = self.cleaned_data['players'].splitlines()
        players = [player.strip() for player in players if player.strip()]
        print(players)
        if not players:
            raise forms.ValidationError("Player names cannot be empty.")
        
        if len(players) != len(set(players)):
            raise forms.ValidationError("Player names must be unique.")
        
        return players
