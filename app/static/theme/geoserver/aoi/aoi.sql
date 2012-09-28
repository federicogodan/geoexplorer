-- Table: aoi

-- DROP TABLE aoi;

CREATE TABLE aoi
(
  id serial NOT NULL,
  glider_name character varying NOT NULL,
  cruise_name character varying NOT NULL,
  the_geom geometry,
  CONSTRAINT aoi_pkey PRIMARY KEY (id),
  CONSTRAINT enforce_dims_the_geom CHECK (st_ndims(the_geom) = 2),
  CONSTRAINT enforce_geotype_the_geom CHECK (geometrytype(the_geom) = 'POLYGON'::text OR the_geom IS NULL),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 4326)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aoi OWNER TO postgres;