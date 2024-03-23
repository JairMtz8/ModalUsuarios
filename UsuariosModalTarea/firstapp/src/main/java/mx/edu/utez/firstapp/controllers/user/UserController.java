package mx.edu.utez.firstapp.controllers.user;

import jakarta.validation.Valid;
import mx.edu.utez.firstapp.config.ApiResponse;
import mx.edu.utez.firstapp.controllers.user.dto.UserDto;
import mx.edu.utez.firstapp.services.user.UserService;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"*"})
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findById(@PathVariable Long id) {
        return service.findUserById(id);
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse> save(@Valid @RequestBody UserDto dto) {
        Long personid = dto.getPersonId();
        return service.save(dto.toEntity(), personid);
    }

    @PatchMapping("/deactivate/{id}")
    public ResponseEntity<ApiResponse> deactivate(@PathVariable Long id) {
        return service.deactivateUser(id);
    }
}
