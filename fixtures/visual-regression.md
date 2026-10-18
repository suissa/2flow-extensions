# 2flow highlighting fixture for Markdown

Use this file to check fenced-block highlighting in VS Code and GitHub.

```2flow
flow delivery
execution process_delivery
classify -> validate
validate !-> human_review
receive <<- event
event ->> actor
outcome :--: accepted
authorize [?user_is_valid]
items [pending, accepted, failed]
result Ok<Delivery>
failure Error<ValidationError>
enabled true
attempts 3
namespace.agent.run
label "quoted string"
# line comment
```

The text outside the fence must retain the host Markdown theme.

Tilde fences should also be accepted by the grammar:

~~~2flow
flow tilde_fence
start -> finish
~~~
