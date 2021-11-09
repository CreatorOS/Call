# Call

`call` is a low level function to interact with other contracts.

This is the recommended method to use when you're just sending Ether via calling the `fallback` function.

However it is not the recommend way to call existing functions.

## Calling a known function

Let's imagine that contract `Caller` does not have the source code for contract `Receiver`, but we do know the address of `Receiver` and the function to call.

Let's write a function to call that function in `Caller` contract:

```
    function testCallFoo(address payable _addr) public payable {
        (bool success, bytes memory data) = _addr.call{value: msg.value, gas: 5000}(
            abi.encodeWithSignature("foo(string,uint256)", "call foo", 123)
        );

        emit Response(success, data);
    }
```

Here we are calling `foo()` with some data using `call()`.
As `call()` is a low-level function the arguments are encoded with `abi.encodeWithSignature`.

- You can send ether and specify a custom gas amount in `call()`

Hit `Run`. In the 2nd test output you will see the we called `testCallFoo()` function and it called `foo` with `call foo` as message and `123` as \_x value.
It should have logged the the `Received` and `Response` events' data.

## Call to a non-existing function

Let's see now what happens when we call a non-existing function.

Code this function in `Caller` contract:

```
    function testCallDoesNotExist(address _addr) public {
        (bool success, bytes memory data) = _addr.call(
            abi.encodeWithSignature("doesNotExist()")
        );

        emit Response(success, data);
    }
```

- Calling a function that does not exist triggers the fallback function.

Hit `Run`. In the 3rd test output you will see `Fallback was called` log in `Received` event log.
