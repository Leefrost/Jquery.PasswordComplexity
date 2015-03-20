# jQuery.PasswordComplexity
Jquery plugin for password`s complexity computing. Very simple and minimalistic.

## Example Usage

Using `jQuery.passwordStrength` is fairly simple — you only need to call a single method on the password field you want the plugin to monitor:

```html
<form action="#">
    <input type="password" id="passwordId" />
</form>

<script type="text/javascript">
    $(function() {
        $("#passwordId").passwordComplexity();
    });
</script>
```

## How does it works?

Algorithm, currently used by this plugin is very simple. 
Each time the user types a character into password field, plugin generate score for inputed password.

By default, you can configure by how much the score increases for ...

  - **each** character,
  - **each** space,
  - the usage of at least one **lowercase** character,
  - the usage of at least one **uppercase** character,
  - the usage of at least one **number**, and
  - the usage of at least one **symbol**.

To determine the password complexity, the algorithm computes how many percent of the secure strength a user reached
and assigns one of the following five classes to the password complexity indicator display element accordingly:

  - *very-weak*
  - *weak*
  - *mediocre*
  - *strong*
  - *very-strong*

You can add classes to or remove classes from the existing array without having to modify the plugin itself.
Note that classes in the `strengthClassNames` array need to be ordered from the weakest to the strongest
as the index of the class to return is computed according to the achived score (it's distributed linearly).

To display the password complexity, you can simply apply CSS formatting to the classes provided;
please refer to the demos for examples.