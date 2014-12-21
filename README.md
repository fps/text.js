# text.js

A very very very simple paste site.

# Why?

Because we needed a simple paste site for our team where we had control over the data. 

# And?

Because we thought that we could save one or two actions (clicks, copy and paste) compared to other paste sites like http://pastebin.com. On most pastesites the flow goes like this:

* Open e.g. http://pastebin.com
* Paste the text into the text field
* [Optional] Enter a capcha
* Press the submit button
* Share the resulting URL

That is four steps (five if you're unlucky and have to enter a capcha). With text.js this reduces down to two:

* Open e.g. http://fps.io/txt (a new session is automatically created and you're redirected to it)
* Paste the text into the input field
* Share the URL

This is three steps. That is one less than usual. Yay for productivity. You can even reduce it to two if you care to choose the session id beforehand yourself:

* Open http://fps.io:21324/text/mysupersessionname
* Paste the text

The step of sharing the URL is not needed anymore since all other clients already know the session id and can just open the same URL.

# Aaaaand?

Because we wanted a super uncluttered interface where the interface is not in the way of the text. The text is what it's all about.

# Is it secure?

* No secure connection is used at this point. This might change in the future.
* The process can be rather easily DDOS'ed since no restrictions on number of sessions or total text length are imposed yet.

# Author

Florian Paul Schmidt (mista.tapas@gmx.net)

