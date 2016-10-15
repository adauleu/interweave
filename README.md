# Interweave v0.5.0
[![Build Status](https://travis-ci.org/milesj/interweave.svg?branch=master)](https://travis-ci.org/milesj/interweave)

Interweave is a robust React library that can...

* Safely render HTML without using `dangerouslySetInnerHTML`.
* Clean HTML attributes using filters.
* Match and replace text using matchers.
* Autolink URLs, IPs, emails, and hashtags.
* Render or replace Emoji characters.
* And much more!

## Requirements

* ES2015
* React 0.14+
* IE9+

## Installation

Interweave requires React as a peer dependency.

```
npm install interweave react --save
```

## Usage

Interweave can primarily be used through the `Interweave` and `Markup`
components, both of which provide an easy, straight-forward implementation
for safely [parsing and rendering HTML](#html-parsing) without using
`dangerouslySetInnerHTML` ([Facebook][dangerhtml]).

The `Interweave` component has the additional benefit of utilizing
[filters](#filters), [matchers](#matchers), and callbacks.

```javascript
import Interweave from 'interweave';

<Interweave
    tagName="div"
    className="foo"
    content="This string <b>contains</b> HTML."
/>
```

#### Props

* `content` (string) - The string to render and apply matchers and
  filters to. Supports HTML.
* `emptyContent` (node) - React node to render if no content was
  rendered.
* `tagName` (div | span | p) - The HTML element tag name to wrap the
  output with. Defaults to "span".
* `className` (string) - Class name to append to the HTML element.
* `filters` (Filter[]) - Filters to apply to this local instance.
* `matchers` (Matcher[]) - Matchers to apply to this local instance.
* `disableFilters` (boolean) - Disables both global and local filters.
* `disableMatchers` (boolean) - Disables both global and local matchers.
* `noHtml` (boolean) - Strips HTML tags from the content string while
  parsing.
* `onBeforeParse` (func) - Callback that fires before parsing. Is
  passed the source string and must return a string.
* `onAfterParse` (func) => Callback that fires after parsing. Is
  passed an array of strings/elements and must return an array.

### Markup

Unlike the `Interweave` component, the `Markup` component does not
support matchers, filters, or callbacks. This component is preferred
when rendering strings that contain HTML is the primary use case.

```javascript
import { Markup } from 'interweave';

<Markup content="This string <b>contains</b> HTML." />
```

#### Props

The `Markup` component only supports the `content`, `emptyContent`,
`tagName`, and `className` props mentioned previously.

## Documentation

* [Matchers](#matchers)
    * [Creating A Matcher](#creating-a-matcher)
    * [Rendered Components](#rendered-components)
* [Filters](#filters)
    * [Creating A Filter](#creating-a-filter)
* [Autolinking](#autolinking)
    * [URLs, IPs](#urls-ips)
    * [Emails](#emails)
    * [Hashtags](#hashtags)
* [HTML Parsing](#html-parsing)
    * [Tag Whitelist](#tag-whitelist)
    * [Attribute Whitelist](#attribute-whitelist)

### Matchers

#### Creating A Matcher

#### Rendered Components

### Filters

#### Creating A Filter

### Autolinking

Autolinking is the concept of matching patterns within a string and
wrapping the matched result in an anchor link (an `<a>` tag).
This can be achieved with the [matchers](#matchers) described below.

Note: The regex patterns in use for autolinking do not conform to the
official RFC specifications, as we need to take into account word
boundaries, punctuation, and more. Instead, the patterns will do their
best to match against the majority common use cases.

#### URLs, IPs

The `UrlMatcher` will match most variations of a URL and its segments.
This includes the protocol, user and password auth, host, port, path,
query, and fragment.

```javascript
import Interweave from 'interweave';
import UrlMatcher from 'interweave/matchers/Url';

// Global
Interweave.addMatcher(new UrlMatcher('url'));

// Local
<Interweave matchers={[new UrlMatcher('url')]} />
```

The `UrlMatcher` does not support IP based hosts as I wanted a clear
distinction between supporting these two patterns separately. To support
IPs, use the `IpMatcher`, which will match hosts that conform to a
valid IPv4 address (IPv6 not supported). Like the `UrlMatcher`, all
segments are included.

```javascript
import IpMatcher from 'interweave/matchers/Ip';
```

If a match is found, a [Url](#rendered-components) component or matcher
factory will be rendered and passed the following props.

* `children` (string) - The entire URL/IP that was matched.
* `urlParts` (object)
    * `scheme` (string) - The protocol. Defaults to "http".
    * `auth` (string) - The username and password authorization,
      excluding `@`.
    * `host` (string) - The host, domain, or IP address.
    * `port` (number) - The port number.
    * `path` (string) - The path.
    * `query` (string) - The query string.
    * `fragment` (string) - The hash fragment, including `#`.

#### Emails

The `EmailMatcher` will match an email address and link it using a
"mailto:" target.

```javascript
import Interweave from 'interweave';
import EmailMatcher from 'interweave/matchers/Email';

// Global
Interweave.addMatcher(new EmailMatcher('email'));

// Local
<Interweave matchers={[new EmailMatcher('email')]} />
```

If a match is found, an [Email](#rendered-components) component or
matcher factory will be rendered and passed the following props.

* `children` (string) - The entire email address that was matched.
* `emailParts` (object)
    * `username` (string) - The username. Found before the `@`.
    * `host` (string) - The host or domain. Found after the `@`.

#### Hashtags

The `HashtagMatcher` will match a common hashtag (like Twitter and
Instagram) and link to it using a custom URL (passed as a prop).
Hashtag matching supports alpha-numeric (`a-z0-9`), underscore (`_`),
and dash (`-`) characters, and must start with a `#`.

Hashtags require a URL to link to, which is defined by the
`hashtagUrl` prop. The URL must declare the following token,
`{{hashtag}}`, which will be replaced by the matched hashtag.

```javascript
import Interweave from 'interweave';
import HashtagMatcher from 'interweave/matchers/Hashtag';

const hashtagUrl = 'https://twitter.com/hashtag/{{hashtag}}';

// Global
Interweave.configure({ hashtagUrl });
Interweave.addMatcher(new HashtagMatcher('hashtag'));

// Local
<Interweave
    hashtagUrl={hashtagUrl}
    matchers={[new HashtagMatcher('hashtag')]}
/>
```

If a match is found, a [Hashtag](#rendered-components) component or
matcher factory will be rendered and passed the following props.

* `children` (string) - The entire hashtag that was matched.
* `hashtagName` (string) - The hashtag name without `#`.

### HTML Parsing

Interweave doesn't rely on an HTML parser for rendering HTML safely,
instead, it uses the DOM itself. It accomplishes this by using
`DOMImplementation.createHTMLDocument` ([MDN][domhtml]), which creates
an HTML document in memory, allowing us to easily set markup,
aggregate nodes, and generate React elements. This implementation is
supported by all modern browsers and IE9+.

`DOMImplementation` has the added benefit of not requesting resources
(images, scripts, etc) until the document has been rendered to the page.
This provides an extra layer of security by avoiding possible CSRF
and arbitrary code execution.

Furthermore, Interweave manages a whitelist of both HTML tags and
attributes, further increasing security, and reducing the risk of XSS
and vulnerabilities.

#### Tag Whitelist

Interweave keeps a mapping of valid [HTML tags to parsing
configurations][tagwhitelist]. These configurations handle the following
rules and processes.

* Defines the type of rule: allow (render element and children),
  pass-through (ignore element and render children), deny (ignore both).
* Defines the type of tag: inline, block, inline-block.
* Flags whether inline children can be rendered.
* Flags whether block children can be rendered.
* Flags whether children of the same tag name can be rendered.
* Maps the parent tags the current element can render in.
* Maps the child tags the current element can render.

Lastly, any tag not found in the mapping will be flagged using the
rule "deny", and promptly not rendered.

#### Attribute Whitelist

Interweave takes parsing a step further, by also [filtering](#filters)
attribute values on all parsed HTML elements. Like tags, a mapping of
valid [HTML attributes to parser rules][attrwhitelist] exist. A rule
can be one of: allow and cast to string (default), allow and cast to
number, allow and cast to boolean, and finally, deny.

Also like the tag whitelist, any attribute not found in the mapping is
ignored.

[dangerhtml]: https://facebook.github.io/react/tips/dangerously-set-inner-html.html
[domhtml]: https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createHTMLDocument
[tagwhitelist]: https://github.com/milesj/interweave/blob/master/src/constants.js#L88
[attrwhitelist]: https://github.com/milesj/interweave/blob/master/src/constants.js#L381
