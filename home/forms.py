from django import forms

class submit(forms.Form):
    data = forms.CharField(widget=forms.HiddenInput())

class PhoneNMB(forms.Form):
    NMB = forms.CharField(label='Telefonnummer', max_length=11)
