package mx.edu.utez.firstapp.controllers.person;

import jakarta.validation.Valid;
import mx.edu.utez.firstapp.config.ApiResponse;
import mx.edu.utez.firstapp.controllers.person.dto.PersonDto;
import mx.edu.utez.firstapp.models.person.Person;
import mx.edu.utez.firstapp.services.person.PersonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/person")
@CrossOrigin(origins = {"*"})
public class PersonController {
    private final PersonService service;

    public PersonController(PersonService service) {
        this.service = service;
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse> register(
            @Valid @RequestBody PersonDto dto
    ) {
        return service.save(dto.toEntity());
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updatePerson(@PathVariable Long id, @RequestBody PersonDto personDetails) {
        return service.updatePerson(id, personDetails.toEntity());
    }

    @PatchMapping("/deactivate/{id}")
    public ResponseEntity<ApiResponse> deactivate(@PathVariable Long id) {
        return service.deactivate(id);
    }


}
