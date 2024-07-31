package com.globalct.pam.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SimpleApiRestController {

    @Operation(summary = "Test API route")
    @GetMapping
    public Map<String, Object> getAPI() {
        var map = new HashMap<String, Object>();
        map.put("number", 42);
        map.put("string", "Random String");
        var json = new HashMap<String, Object>();
        json.put("tech", "Java");
        json.put("clean", false);
        map.put("json", json);
        return map;
    }
}
