package com.arkadiuszG.demo.repository;

import com.arkadiuszG.demo.model.Photo;
import org.hibernate.boot.archive.internal.JarProtocolArchiveDescriptor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo,Long> {

    List<Photo> findByCategory(String category);
}
