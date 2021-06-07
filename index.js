var stylelint = require("stylelint");
var postcss = require('postcss');
var _ = require('underscore');
var ruleName = "plugin/stylelint-disallow-vendor-prefix";
var validateOptions = require('stylelint/lib/utils/validateOptions');

var messages = stylelint.utils.ruleMessages(ruleName, {
    expected: function(property) {
        return "unexpected vendor prefix " + property;
    }
});

module.exports = stylelint.createPlugin(ruleName, function(enabled, secondaryoptions) {
    if (!enabled) {
        return;
    }
    var blockedProps = [].concat(secondaryoptions.properties);
    return function(root, result) {
        var validOptions = validateOptions(
            result,
            ruleName, {
                actual: blockedProps,
                possible: [_.isString, _.isRegExp]
            }
        );

        if (!validOptions) return;
        root.walkRules(function(rule) {
            if (rule != undefined) {
                rule.nodes.forEach(function(property) {
                    try {
                        if (property.prop != undefined && property.prop.startsWith('-')) {
                            var unprefixedProp = postcss.vendor.unprefixed(property.prop);
                            var isValid = true;
                            blockedProps.every(function(disallowedProp) {
                                if (_.isString(disallowedProp)) {
                                    if (disallowedProp.startsWith('/') && disallowedProp.endsWith('/')) {
                                        disallowedProp = disallowedProp.substr(1, disallowedProp.length - 2);
                                        var regExp = new RegExp(disallowedProp);
                                        if (regExp.test(disallowedProp)) {
                                            isValid = false;
                                        }
                                    } else if (unprefixedProp == disallowedProp) {
                                        isValid = false;
                                    }
                                }
                                if (!isValid) {
                                    isValid = true;
                                    stylelint.utils.report({
                                        result,
                                        ruleName,
                                        message: messages.expected(property.prop),
                                        node: property,
                                        word: property.prop
                                    });
                                    return false;
                                }
                                return true;
                            });
                        }

                    } catch (err) {
                        console.log(err);
                    }

                });
            }
        });
    }
});
module.exports.primaryOptionArray = true;
module.exports.ruleName = ruleName;
module.exports.messages = messages;