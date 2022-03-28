from os import link
from django.forms import forms
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import login, authenticate
from django.template import context
from .forms import PhoneNMB, submit
from .models import Event, Field
import json
import swish

# Create your views here.
swish_client = swish.SwishClient(
    environment=swish.Environment.Test,
    merchant_swish_number='1231181189',
    cert=('/path/to/cert.pem', '/path/to/key.pem'),
    verify='/path/to/swish.pem'
)
#login
def loginpage(request):
    context= {}
    context['loginform'] = AuthenticationForm()
    if request.method == 'POST':
        print('tried to login')
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            print('sent home')
            return redirect(main)
    return render(request, "home/login.html", context)

def register(request):
    context = {}
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('/login')
    context['registerForm'] = UserCreationForm()
    return render(request, "home/register.html", context)

#home for user
def main(request):
    context = {}
    context['pi'] = "info"

    #loads the events
    user_id = request.user.id
    user = User.objects.get(pk=user_id)
    events = user.event_set.all()
    context['events'] = events

    return render(request, "home/main.html", context)

def newevent(request):
    context = {}
    if(request.method == 'POST'):
        form = submit(request.POST)
        if form.is_valid():
            data = form.cleaned_data.get('data')

            #load data into model, 
            
            #create the event
            user_id = request.user.id
            user = User.objects.get(pk=user_id)
            print(data)
            nevent = Event(user = user, data = data)#, titel=data['eventDes']['eventName'], description=data['eventDes']['eventName'])
            nevent.save()

            data = json.loads(data)

            #import the fields 
            for f in data['fields']:
                field = Field(event = nevent, position = f['position'],titel=f['titel'], type=f['type'], answer=f['answer'], reqornot=False)
                field.save()
            
    context['input'] = submit()

    return render(request, "home/forms.html", context)

#funktionen som användarna kommer att använda 
def showevent(request, slug): 
    #get the event 
    user_id = request.user.id
    user = User.objects.get(pk=user_id)
    context = {}
    events = Event.objects.filter(slug=slug)
    context['data'] = events[0].data

    #post the data on payment

    return render(request, "home/event.html", context)


#swish
def goToPayment(request):

    context = {}
    context['paymentForm'] = PhoneNMB()
    if(request.method == 'POST'):
        form = PhoneNMB(request.POST)
       
        
        if form.is_valid():
            phone= form.cleaned_data.get('NMB')
            print(phone)
            waitforpaymentsucces(phone,420, "msg")
    return render(request, "home/payment.html", context)


def waitforpaymentsucces(payer,sum, msg):
    print(payer,sum, msg)
    createclient(payer,sum, msg)


def createclient(payer,sum, msg):
    payment = swish_client.create_payment(payee_payment_reference='0123456789',callback_url='https://example.com/api/swishcb/paymentrequests', payer_alias=payer,amount=sum,currency='SEK',message=msg)
    return payment