# jahirul1404092.github.io

Personal academic portfolio of Md Jahirul Islam, published with GitHub Pages at
<https://jahirul1404092.github.io/>.

The site is a single static page with no build step and no frameworks.

```
index.html                    the whole site
404.html                      not-found page
css/style.css                 styles (light and dark themes)
js/site.js                    menu, theme toggle, active nav, contact form
fonts/                        self-hosted Newsreader and IBM Plex Sans (SIL OFL)
images/profile.jpg            hero photo
images/og-image.png           preview image for links shared on social media
images/apple-touch-icon.png   home-screen icon
favicon.svg                   tab icon
Md_Jahirul_Islam_Resume.pdf   the CV behind every "Download CV" button
```

## Updating the CV

Replace `Md_Jahirul_Islam_Resume.pdf` with the new PDF and keep the file name.
Every CV link on the site points to it, and the direct URL
<https://jahirul1404092.github.io/Md_Jahirul_Islam_Resume.pdf> stays valid.

## Contact form (one-time activation)

The form in the Contact section posts to [FormSubmit](https://formsubmit.co), which
forwards each message to jahirul.amsa@gmail.com. No account is needed, but the
address has to be activated once:

1. After the site is live, open the Contact section, fill in the form, and send a
   test message. On this first submission FormSubmit shows its own page saying an
   activation email has been sent.
2. Open the activation link in that email.
3. Send one more test message from the site. From now on messages are sent in the
   background and the page shows "Message sent" without leaving the site.

Optional: after activation, FormSubmit's confirmation page shows a random-string
endpoint such as `https://formsubmit.co/el/xxxxxx`. Replacing the address in the
form's `action` attribute (in `index.html`) with that endpoint keeps the email out
of the page source. `js/site.js` derives the AJAX endpoint from `action`, so no
other change is needed.

If you'd rather use another service (Formspree, Web3Forms, Netlify Forms), swap the
form's `action` and adjust the `fetch` call in `js/site.js`.

## Editing content

All content is plain HTML in `index.html`, grouped by section (`about`,
`experience`, `publications`, `projects`, `skills`, `education`, `service`,
`contact`). Publications and dated lists are ordered newest first.

## Local preview

Any static server works, for example:

```
python3 -m http.server 8000
```

then open <http://localhost:8000>.
