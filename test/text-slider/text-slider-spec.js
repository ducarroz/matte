/*global require,exports,describe,it,expect,waits,runs */
var Montage = require("montage").Montage;
var TestPageLoader = require("montage-testing/testpageloader").TestPageLoader;

TestPageLoader.queueTest("text-slider-test", function(testPage) {
    var test;
    beforeEach(function() {
        test = testPage.test;
    });

    describe("test/text-slider/text-slider-spec", function() {

        describe("text-slider", function() {
            it("can be created", function() {
                expect(test.number).toBeDefined();
            });

            it("increases when dragged right", function() {
                var oldValue = test.number.value;
                testPage.dragElementOffsetTo(test.number.element, 50, 0, null, function() {
                    var newValue = oldValue + 50;
                    expect(test.number.value).toBe(newValue);
                    expect(test.number.templateObjects.value.value).toBe(newValue);
                }, null);
            });
            it("decreases when dragged left", function() {
                var oldValue = test.number.value;
                testPage.dragElementOffsetTo(test.number.element, -50, 0, null, function() {
                    var newValue = oldValue - 50;
                    expect(test.number.value).toBe(newValue);
                    expect(test.number.templateObjects.value.value).toBe(newValue);
                }, null);
            });
            it("increases when dragged up", function() {
                var oldValue = test.number.value;
                testPage.dragElementOffsetTo(test.number.element, 0, -50, null, function() {
                    var newValue = oldValue + 50;
                    expect(test.number.value).toBe(newValue);
                    expect(test.number.templateObjects.value.value).toBe(newValue);
                }, null);
            });
            it("decreases when dragged down", function() {
                var oldValue = test.number.value;
                testPage.dragElementOffsetTo(test.number.element, 0, 50, null, function() {
                    var newValue = oldValue - 50;
                    expect(test.number.value).toBe(newValue);
                    expect(test.number.templateObjects.value.value).toBe(newValue);
                }, null);
            });
            it("it doesn't decrease when dragging up and left", function() {
                var element = test.number.element;
                var oldValue = test.number.value;

                testPage.mouseEvent({target: element}, "mousedown");

                // Mouse move doesn't happen instantly
                waits(10);
                runs(function() {
                    testPage.mouseEvent({
                        target: element,
                        clientX: element.offsetLeft,
                        clientY: element.offsetTop - 50
                    }, "mousemove");

                    expect(test.number.value).toBe(oldValue + 50);

                    waits(10);
                    runs(function() {
                        var eventInfo = testPage.mouseEvent({
                            target: element,
                            clientX: element.offsetLeft - 60,
                            clientY: element.offsetTop - 50
                        }, "mousemove");
                        // mouse up
                        testPage.mouseEvent(eventInfo, "mouseup");

                        // It should not be -60, even though the left magnitude
                        // is greater that the up magnitude here.
                        expect(test.number.value).toBe(oldValue + 50);


                    });
                });
            });

            describe("minValue", function() {
                it("restricts value", function() {
                    test.percent.value = -1;
                    expect(test.percent.value).toBe(0);
                });
            });
            describe("maxValue", function() {
                it("restricts value", function() {
                    test.percent.value = 101;
                    expect(test.percent.value).toBe(100);
                });
            });

            describe("text field", function() {
                it("appears when the text-slider is clicked", function() {
                    test.hex.value = 160;
                    test.hex.handlePress();
                    expect(test.hex.isEditing).toBe(true);
                    testPage.waitForDraw();
                    runs(function() {
                        expect(test.hex.element.className).toMatch("matte-TextSlider--editing");
                    });
                });
                it("increases when the up arrow is pressed", function() {
                    test.hex.handleInputKeydown({target: test.hex._inputElement, keyCode: 38});
                    expect(test.hex.value).toBe(161);
                    testPage.waitForDraw();
                    runs(function() {
                        expect(test.hex._inputElement.value).toBe("A1");
                    });
                });
                it("decreases when the down arrow is pressed", function() {
                    test.hex.handleInputKeydown({target: test.hex._inputElement, keyCode: 40});
                    expect(test.hex.value).toBe(160);
                    testPage.waitForDraw();
                    runs(function() {
                        expect(test.hex._inputElement.value).toBe("A0");
                    });
                });
                it("sets the value when enter is set", function() {
                    test.hex._inputElement.value = "2A";
                    test.hex.handleInputKeydown({target: test.hex._inputElement, keyCode: 13});
                    expect(test.hex.value).toBe(42);
                });
                it("ignored any entered value when Esc is pressed", function() {
                    test.hex.value = 160;
                    test.hex.handlePress();
                    test.hex._inputElement.value = "00";
                    test.hex.handleInputKeydown({target: test.hex._inputElement, keyCode: 27});
                    expect(test.hex.value).toBe(160);
                });
            });
        });
    });
});
