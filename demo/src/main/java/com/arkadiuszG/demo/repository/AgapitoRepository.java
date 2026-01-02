package com.arkadiuszG.demo.repository;

import com.arkadiuszG.demo.model.Agapito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgapitoRepository extends JpaRepository<Agapito,Long> {


}
