Feature: installation of libraries to a central directory

  Scenario: I can install a library at a specific version
    When I run particle "library install neopixel@0.0.9 --dest=."
    Then a directory named "neopixel@0.0.9" should exist
    And a file named "neopixel@0.0.9/library.properties" should exist
    And a file named "neopixel@0.0.9/src/neopixel.cpp" should exist
    And the output should contain "installed"

  Scenario: I can install the latest version of library
    When I run particle "library install neopixel --dest=."
    Then a directory named "neopixel@0.0.10" should exist
    And a file named "neopixel@0.0.10/library.properties" should exist
    And a file named "neopixel@0.0.10/src/neopixel.cpp" should exist
    And the output should contain "installed"

  Scenario: I cannot install a non-existent version of library
    When I run particle "library install neopixel@99.88.77 --dest=."
    And the output should contain "Version 99.88.77 not found"

